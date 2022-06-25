using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading;
using System.Threading.Tasks;
using FFMpegCore;
using FFMpegCore.Enums;
using FFMpegCore.Pipes;
using ImageMagick;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using ModelSaber.Database;
using ModelSaber.Models;
using Prometheus;

namespace ModelSaber.Main.Services
{
    public class FileService
    {
        private static Dictionary<Guid, string> _thumbnailUploadQueue = new();
        private static Dictionary<Guid, string> _modelUploadQueue = new();
        private static readonly string _processList = Path.Combine(Directory.GetCurrentDirectory(), "fileServiceProcess.json");
        private readonly object _lock = new();
        private readonly Summary _thumbnailsQueue = Metrics.CreateSummary("model_saber_thumbnails_queue_size", "Number of models in thumbnail upload queue", new SummaryConfiguration
        {
            Objectives = new[]
            {
                new QuantileEpsilonPair(0.5, 0.05),
                new QuantileEpsilonPair(0.9, 0.01),
                new QuantileEpsilonPair(0.99, 0.005),
                new QuantileEpsilonPair(0.999, 0.001)
            }
        });
        private readonly Summary _modelsQueue = Metrics.CreateSummary("model_saber_models_queue_size", "Number of models in model upload queue", new SummaryConfiguration
        {
            Objectives = new[]
            {
                new QuantileEpsilonPair(0.5, 0.05),
                new QuantileEpsilonPair(0.9, 0.01),
                new QuantileEpsilonPair(0.99, 0.005),
                new QuantileEpsilonPair(0.999, 0.001)
            }
        });

        private static readonly MagickGeometry _geometry = new()
        {
            Greater = true,
            Height = 512,
            Width = 512,
            Less = false
        };

        private readonly IServiceProvider _provider;
        private readonly Timer _timer;

        public FileService(IServiceProvider provider)
        {
            _provider = provider;
            if (File.Exists(_processList))
            {

                using var stream = File.OpenText(_processList);
                try
                {
                    var document = JsonDocument.Parse(stream.ReadToEnd());
                    var toProcessList = document.Deserialize<FileServiceProcessList>();
                    if (toProcessList != null)
                    {
                        _modelUploadQueue = toProcessList.ModelQueue;
                        _thumbnailUploadQueue = toProcessList.ThumbnailQueue;
                    }
                }
                catch
                {
                    // ignored
                }

                stream.Dispose();
            }

            _timer = new Timer(UploadScheduler, null, 0, Constants.UploadSleepTime);
            _timer = new Timer(SaveQueue, null, 60000, 100);
        }

        private void SaveQueue(object? stateInfo)
        {
            lock (_lock)
            {
                File.WriteAllText(_processList, JsonSerializer.Serialize(new FileServiceProcessList(_modelUploadQueue, _thumbnailUploadQueue)));
            }
        }

        private void UploadScheduler(object? stateInfo)
        {
            try
            {
                using var dbContext = _provider.CreateScope().ServiceProvider.GetRequiredService<ModelSaberDbContext>();
                var thumbnailUploadQueueProcessed = new List<Guid>();
                var modelUploadQueueProcessed = new List<Guid>();
                KeyValuePair<Guid, string>[] thumbnailUploadQueue;
                KeyValuePair<Guid, string>[] modelUploadQueue;
                lock (_lock)
                {
                    thumbnailUploadQueue = _thumbnailUploadQueue.ToArray();
                    modelUploadQueue = _modelUploadQueue.ToArray();
                }

                foreach (var (id, file) in thumbnailUploadQueue)
                {
                    if (Constants.UploadEnabled)
#pragma warning disable CS0162
                    {
                        //TODO add logic for storage bucket
                        using var stream = File.OpenRead(file);
                    }
#pragma warning restore CS0162
                    else
                    {
                        var thumbnail = dbContext.Models.First(t => t.Uuid == id).Thumbnail;
                        var path = Path.Combine(Directory.GetCurrentDirectory(), "ClientApp", "public", thumbnail);
                        if (!Directory.Exists(Path.GetDirectoryName(path)))
                            Directory.CreateDirectory(Path.GetDirectoryName(path)!);
                        File.Move(file, path);
                        thumbnailUploadQueueProcessed.Add(id);
                    }
                }

                foreach (var (id, file) in modelUploadQueue)
                {
                    if (Constants.UploadEnabled)
#pragma warning disable CS0162
                    {
                        //TODO add logic for storage bucket
                        using var stream = File.OpenRead(file);
                    }
#pragma warning restore CS0162
                    else
                    {
                        var model = dbContext.Models.First(t => t.Uuid == id);
                        var path = Path.Combine(Directory.GetCurrentDirectory(), "ClientApp", "public", "models", $"{id}.{model.Type.GetTypeExt()}");
                        if (!Directory.Exists(Path.GetDirectoryName(path)))
                            Directory.CreateDirectory(Path.GetDirectoryName(path)!);
                        File.Move(file, path);
                        modelUploadQueueProcessed.Add(id);
                    }
                }

                lock (_lock)
                {
                    modelUploadQueueProcessed.ForEach(id => _modelUploadQueue.Remove(id));
                    thumbnailUploadQueueProcessed.ForEach(id => _thumbnailUploadQueue.Remove(id));
                }
            }
            catch (Exception e)
            {
                //TODO add logger
            }
        }

        public async Task HandleModelFile(IFormFile file, Guid modelId)
        {
            await using var modelStream = file.OpenReadStream();
            var tmp = new FileInfo(Path.Combine(Directory.GetCurrentDirectory(), Constants.TempDirectory, Guid.NewGuid().ToString("N")));
            var tmpStream = tmp.OpenWrite();
            await modelStream.CopyToAsync(tmpStream);
            await tmpStream.DisposeAsync();
            lock (_lock)
            {
                _modelUploadQueue.Add(modelId, tmp.FullName);
                _modelsQueue.Observe(_modelUploadQueue.Count);
            }
        }

        public async Task HandleThumbnailFile(IFormFile file, Guid modelId, ThumbnailEnum thumbnailType)
        {
            await using var thumbnailInputStream = file.OpenReadStream();
            await using var thumbnailOutputStream = await (thumbnailType switch
            {
                ThumbnailEnum.Video => HandleThumbnailVideo(thumbnailInputStream),
                ThumbnailEnum.Image => HandleThumbnailImage(thumbnailInputStream),
                _ => throw new ArgumentException("Error processing thumbnail")
            });
            thumbnailOutputStream.Seek(0, SeekOrigin.Begin);
            var tmp = new FileInfo(Path.Combine(Directory.GetCurrentDirectory(), Constants.TempDirectory, Guid.NewGuid().ToString("N")));
            var stream = tmp.OpenWrite();
            await thumbnailOutputStream.CopyToAsync(stream);
            await stream.DisposeAsync();
            lock (_lock)
            {
                _thumbnailUploadQueue.Add(modelId, tmp.FullName);
                _thumbnailsQueue.Observe(_thumbnailUploadQueue.Count);
            }
        }

        private async Task<Stream> HandleThumbnailImage(Stream stream)
        {
            //check if image is 1:1 or larger or equal to 256x256
            using var image = new MagickImage(stream);
            var aspect = (float)image.Width / image.Height;
            if (Math.Abs(aspect - 1) > float.Epsilon)
                throw new FormatException("Aspect ratio not 1:1");
            if (image.Width < 256)
                throw new FormatException("Size not at or greater than 256x256");

            //resize image if its above 512x512
            image.InterpolativeResize(_geometry, PixelInterpolateMethod.Bilinear);

            //convert to webp
            var outputStream = new MemoryStream();
            await image.WriteAsync(outputStream, MagickFormat.WebP);
            return outputStream;
        }

        private async Task<Stream> HandleThumbnailVideo(Stream stream)
        {
            //creating temp file
            var file = new FileInfo(Path.Combine(Directory.GetCurrentDirectory(), Constants.TempDirectory, Guid.NewGuid().ToString("N")));
            var tmp = file.OpenWrite();
            await stream.CopyToAsync(tmp);
            await tmp.DisposeAsync();

            //check if file is 1:1 or larger than 256x256
            var info = await FFProbe.AnalyseAsync(file.FullName);
            var width = info.VideoStreams[0].Width;
            var height = info.VideoStreams[0].Height;
            var aspect = (float)width / height;
            if (Math.Abs(aspect - 1) >= float.Epsilon)
            {
                file.Delete();
                throw new FormatException("Aspect ratio not 1:1");
            }

            if (width < 256)
            {
                file.Delete();
                throw new FormatException("Size not at or greater than 256x256");
            }

            //convert to webm and resize if over 512x512
            var outputStream = new MemoryStream();
            await FFMpegArguments
                .FromFileInput(file.FullName)
                .OutputToPipe(new StreamPipeSink(outputStream), options => options
                    .WithVideoCodec("libvpx-vp9")
                    .ForceFormat("webm")
                    .WithConstantRateFactor(12)
                    .WithFramerate(60)
                    .WithFastStart()
                    .ForcePixelFormat("yuva420p")
                    .WithVideoBitrate(500)
                    .DisableChannel(Channel.Audio)
                    .WithCustomArgument("-vf \"scale='min(512,iw)':-1\"")
                    .WithCustomArgument("-quality good")
                    .WithCustomArgument("-cpu-used 0"))
                .ProcessAsynchronously();

            file.Delete();

            return outputStream;
        }
    }

    internal class FileServiceProcessList
    {
        public Dictionary<Guid, string> ThumbnailQueue;
        public Dictionary<Guid, string> ModelQueue;

        public FileServiceProcessList(Dictionary<Guid, string> modelUploadQueue, Dictionary<Guid, string> thumbnailUploadQueue)
        {
            ModelQueue = modelUploadQueue;
            ThumbnailQueue = thumbnailUploadQueue;
        }
    }
}
