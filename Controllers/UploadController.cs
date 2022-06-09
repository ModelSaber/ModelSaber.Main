using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ModelSaber.Database;
using ModelSaber.Main.Parser;
using ModelSaber.Main.Services;
using ModelSaber.Models;

namespace ModelSaber.Main.Controllers
{
    [ApiController]
    //[Authorize]
    public class UploadController : ControllerBase
    {
        private readonly ModelSaberDbContext _dbContext;
        private readonly FileService _fileService;

        public UploadController(ModelSaberDbContext dbContext, FileService fileService)
        {
            _dbContext = dbContext;
            _fileService = fileService;
        }

        [HttpPost("api/upload")]
        public async Task<IActionResult> Upload([FromForm] UploadModel model)
        {
            var user = (User?)HttpContext.Items["User"];
            Model dbModel;
            try
            {
                switch (model.IsCreate)
                {
                    case false when !model.IsUpdate:
                        return BadRequest("Missing one or more parameters");
                    case true:
                        {
                            dbModel = await HandleThumbnailFile(model, user);
                            _dbContext.Models.Add(dbModel);
                            break;
                        }
                    default:
                        {
                            dbModel = await HandleThumbnailFile(model, user);
                            dbModel.Status = Status.Unpublished & Status.ApprovalRequired;
                            break;
                        }
                }
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }

            await _dbContext.SaveChangesAsync();
            return Ok(_dbContext.Models.First(t => t.Uuid == dbModel.Uuid));
        }

        private async Task<Model> HandleThumbnailFile(UploadModel model, User? user)
        {
            if (user == null)
            {
                throw new ArgumentNullException(nameof(user), "Invalid user");
            }
            var dbModel = model.ModelId.HasValue ? _dbContext.Models.First(t => t.Id == model.ModelId.Value) : model.CreateModel(user?.Id ?? 0);

            await _fileService.HandleThumbnailFile(model.Img!, dbModel.Uuid, dbModel.ThumbnailExt!.Value);

            return dbModel;
        }
    }

    public class UploadModel
    {
        public IFormFile? Model { get; set; }
        public IFormFile? Img { get; set; }
        public uint? ModelId { get; set; }
        public TypeEnum? Type { get; set; }
        public Platform? Platform { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
        public bool? Nsfw { get; set; }

        public bool IsUpdate => Model != null && Img != null && ModelId != null;
        public bool IsCreate => Model != null && Img != null && Type != null && Platform != null && Name != null && Description != null && Nsfw != null && !string.IsNullOrWhiteSpace(Name);



        public string GetHash()
        {
            using var reader = Model!.OpenReadStream();
            using var md5 = System.Security.Cryptography.MD5.Create();
            var hash = md5.ComputeHash(reader);
            return BitConverter.ToString(hash).Replace("-", string.Empty);
        }

        public UnityHeader GetUnityHeader()
        {
            using var reader = Model!.OpenReadStream();
            return UnityBundle.GetUnityHeader(reader);
        }

        public ThumbnailEnum GetThumbnail() => Img!.ContentType.Split('/')[0] switch
        {
            "image" => Img!.ContentType.Split('/')[1] is not "gif" or "apng" ? ThumbnailEnum.Image : ThumbnailEnum.Video,
            "video" => ThumbnailEnum.Video,
            _ => throw new ArgumentException($"ContentType not supported: {Img!.ContentType.Split('/')[0]}", nameof(Img))
        };

        public Model CreateModel(uint userId)
        {
            var header = GetUnityHeader();
            return new Model
            {
                Description = Description,
                Name = Name!,
                Nsfw = Nsfw!.Value,
                Platform = Platform!.Value,
                Type = Type!.Value,
                Date = DateTime.UtcNow,
                Hash = GetHash(),
                BuildVersion = header.BuildVersion,
                MinVersion = header.MinVersion,
                Status = Status.Unpublished & Status.ApprovalRequired,
                UnitySystem = header.UnitySystem,
                UnitySystemVersion = header.UnitySystemVersion,
                Uuid = Guid.NewGuid(),
                ThumbnailExt = GetThumbnail(),
                UserId = userId
            };
        }
    }
}
