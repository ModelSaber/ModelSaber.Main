using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using Discord;
using Discord.Webhook;
using FFMpegCore;

namespace ModelSaber.Main
{
    public class Program
    {
        public static DateTime CompiledTime { get; private set; }
        public static Version Version { get; private set; } = null!;
        public static DiscordWebhookClient DiscordClient { get; private set; } = null!;

        public static void Main(string[] args)
        {
            var executingAsm = Assembly.GetExecutingAssembly();
            CompiledTime = executingAsm.GetLinkerTime();
            Version = executingAsm.GetName().Version ?? new Version(0,0,420,69);
            CreateTempDirectory();
#if DEBUG
            var envTarget = EnvironmentVariableTarget.User;
#else
            var envTarget = EnvironmentVariableTarget.Process;
#endif
            //TODO fix this for linux as it seems to not grab environment variables for some reason
            //var webhookUrl = Environment.GetEnvironmentVariable("DISCORD_WEBHOOK_URL", envTarget);
            //if (string.IsNullOrWhiteSpace(webhookUrl)) throw new Exception("DISCORD_WEBHOOK_URL cannot be null and must be set.");
            //DiscordClient = new DiscordWebhookClient(webhookUrl);
            CreateHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    #if RELEASE
                    webBuilder.UseUrls("http://localhost:6000");
                    #endif
                    webBuilder.UseStartup<Startup>();
                });

        public static void CreateTempDirectory()
        {
            var tempDir = Path.Combine(Directory.GetCurrentDirectory(), Constants.TempDirectory);
            if (!Directory.Exists(tempDir))
            {
                Directory.CreateDirectory(tempDir);
            }
        }
    }

    public static class Extensions
    {
        public static DateTime GetLinkerTime(this Assembly assembly)
        {
            const string buildVersionMetadataPrefix = "+build";

            var attribute = assembly.GetCustomAttribute<AssemblyInformationalVersionAttribute>();
            if (attribute?.InformationalVersion == null) return default;
            var value = attribute.InformationalVersion;
            var index = value.IndexOf(buildVersionMetadataPrefix, StringComparison.Ordinal);
            if (index <= 0) return default;
            value = value[(index + buildVersionMetadataPrefix.Length)..];
            return DateTime.ParseExact(value, "yyyy-MM-ddTHH:mm:ss:fffZ", CultureInfo.InvariantCulture);
        }

        public static void AddRange<T>(this ICollection<T> collection, IEnumerable<T> enumerable)
        {
            foreach (var element in enumerable)
            {
                collection.Add(element);
            }
        }
    }
}
