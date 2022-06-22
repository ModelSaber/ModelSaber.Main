using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Policy;
using System.Text.RegularExpressions;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ModelSaber.Models;

namespace ModelSaber.Database
{
    public class ModelSaberDbContext : DbContext
    {
        public DbSet<Model> Models { get; set; } = null!;
        public DbSet<ModelTag> ModelTags { get; set; } = null!;
        public DbSet<ModelVariation> ModelVariations { get; set; } = null!;
        public DbSet<ModelUser> ModelUsers { get; set; } = null!;
        public DbSet<Tag> Tags { get; set; } = null!;
        public DbSet<User> Users { get; set; } = null!;
        public DbSet<Vote> Votes { get; set; } = null!;
        public DbSet<UserLogons> Logons { get; set; } = null!;
        public DbSet<UserTags> UserTags { get; set; } = null!;
        public DbSet<OAuthClient> OAuthClients { get; set; } = null!;
        public DbSet<OAuthToken> OAuthTokens { get; set; } = null!;

        public ModelSaberDbContext() : this(new DbContextOptions<ModelSaberDbContext>())
        {

        }

        public ModelSaberDbContext(DbContextOptions<ModelSaberDbContext> options) : base(options)
        {

        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder) => optionsBuilder.UseNpgsql(getConString(), o => o.UseQuerySplittingBehavior(QuerySplittingBehavior.SplitQuery)).UseSnakeCaseNamingConvention();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Model>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.HasMany(e => e.ModelVariations)
                    .WithOne(e => e.ParentModel)
                    .HasForeignKey(e => e.ParentModelId);

                entity.HasMany(e => e.Tags)
                    .WithOne(e => e.Model)
                    .HasForeignKey(e => e.ModelId);

                entity.HasOne(e => e.ModelVariation)
                    .WithOne(e => e.Model)
                    .HasForeignKey<ModelVariation>(e => e.ModelId);

                entity.HasMany(e => e.Users)
                    .WithOne(e => e.Model)
                    .HasForeignKey(e => e.ModelId);

                entity.Ignore(e => e.Thumbnail);
                entity.Ignore(e => e.DownloadPath);
            });

            modelBuilder.Entity<ModelTag>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.HasOne(e => e.Model)
                    .WithMany(e => e.Tags)
                    .HasForeignKey(e => e.ModelId);

                entity.HasOne(e => e.Tag)
                    .WithMany(e => e.ModelTags)
                    .HasForeignKey(e => e.TagId);
            });

            modelBuilder.Entity<ModelVariation>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.HasOne(e => e.Model)
                    .WithOne(e => e.ModelVariation)
                    .HasForeignKey<ModelVariation>(e => e.ModelId);

                entity.HasOne(e => e.ParentModel)
                    .WithMany(e => e.ModelVariations)
                    .HasForeignKey(e => e.ParentModelId);
            });

            modelBuilder.Entity<ModelUser>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.HasOne(e => e.Model)
                    .WithMany(e => e.Users)
                    .HasForeignKey(e => e.ModelId);

                entity.HasOne(e => e.User)
                    .WithMany(e => e.Models)
                    .HasForeignKey(e => e.UserId);
            });

            modelBuilder.Entity<Tag>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.HasMany(e => e.ModelTags)
                    .WithOne(e => e.Tag)
                    .HasForeignKey(e => e.TagId);
            });

            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.HasMany(e => e.Models)
                    .WithOne(e => e.User)
                    .HasForeignKey(e => e.UserId);

                entity.HasMany(e => e.Votes)
                    .WithOne(e => e.User)
                    .HasForeignKey(e => e.UserId);

                entity.HasOne(e => e.Logon)
                    .WithOne(e => e.User!)
                    .HasForeignKey<UserLogons>(e => e.UserId);

                entity.HasMany(e => e.UserTags)
                    .WithOne(e => e.User)
                    .HasForeignKey(e => e.UserId);
            });

            modelBuilder.Entity<Vote>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.HasOne(e => e.Model)
                    .WithMany(e => e.Votes)
                    .HasForeignKey(e => e.ModelId);

                entity.HasOne(e => e.User)
                    .WithMany(e => e.Votes)
                    .HasForeignKey(e => e.UserId);
            });

            modelBuilder.Entity<UserLogons>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.HasOne(e => e.User)
                    .WithOne(e => e!.Logon)
                    .HasForeignKey<UserLogons>(e => e.UserId);
            });

            modelBuilder.Entity<UserTags>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.HasOne(e => e.User)
                    .WithMany(e => e.UserTags)
                    .HasForeignKey(e => e.UserId);
            });

            modelBuilder.Entity<OAuthClient>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.HasMany(e => e.Tokens)
                    .WithOne(e => e.Client)
                    .HasForeignKey(e => e.ClientId);
            });

            modelBuilder.Entity<OAuthToken>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.HasOne(e => e.Client)
                    .WithMany(e => e.Tokens)
                    .HasForeignKey(e => e.ClientId);
            });
        }

        private string getConString()
        {
            var db = "modelsaber_v3";

            var envPW = Environment.GetEnvironmentVariable("MODELSABER_DB_PW");
            var envUser = Environment.GetEnvironmentVariable("MODELSABER_DB_USER");
            var envHost = Environment.GetEnvironmentVariable("MODELSABER_DB_HOST");

            var password = envPW.TryGetValue("postgres");
            var user = envUser.TryGetValue("postgres");
            var host = envHost.TryGetValue("localhost");

#if DEBUG
            return $"Host={host};Database={db};Username={user};Password={password};Include Error Detail=true";
#else
            return $"Host={host};Database={db};Username={user};Password={password}";
#endif

        }
    }

    public static class Extensions
    {
        public static string TryGetValue(this string? s, string def)
        {
            return s ?? def;
        }
    }
}
