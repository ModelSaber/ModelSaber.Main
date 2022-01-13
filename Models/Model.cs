﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GraphQL.Types;
using Newtonsoft.Json;

namespace ModelSaber.Database.Models
{
    public class Model
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public Guid Uuid { get; set; }
        public TypeEnum Type { get; set; }
        public Status Status { get; set; }
        public Platform Platform { get; set; }
        public ThumbnailEnum? ThumbnailExt { get; set; }
        public string? Name { get; set; }
        public string? Hash { get; set; }
        public string? Description { get; set; }
        public string Thumbnail => !ThumbnailExt.HasValue ? "isfmoment.webm" : $"images/{Uuid}{ThumbnailExt?.GetThumbExt()}";
        public string DownloadPath => $"download?id={Uuid}";
        public DateTime Date { get; set; }
        public virtual ICollection<ModelTag> Tags { get; set; } = null!;
        public virtual ICollection<ModelVariation> ModelVariations { get; set; } = null!;
        public virtual ICollection<ModelUser> Users { get; set; } = null!;
        public virtual ICollection<Vote> Votes { get; set; } = null!;
        public virtual ModelVariation ModelVariation { get; set; } = null!;
        public virtual User User { get; set; } = null!;
    }

    public class ModelVariation
    {
        public int Id { get; set; }
        public int ModelId { get; set; }
        public int ParentModelId { get; set; }
        [JsonIgnore]
        public virtual Model Model { get; set; } = null!;
        [JsonIgnore]
        public virtual Model ParentModel { get; set; } = null!;
    }

    public class ModelUser
    {
        public int Id { get; set; }
        public int ModelId { get; set; }
        public int UserId { get; set; }
        [JsonIgnore]
        public virtual Model Model { get; set; } = null!;
        [JsonIgnore]
        public virtual User User { get; set; } = null!;
    }

    public class Vote
    {
        public int Id { get; set; }
        public int ModelId { get; set; }
        public int UserId { get; set; }
        public bool DownVote { get; set; }
        [JsonIgnore]
        public virtual Model Model { get; set; } = null!;
        [JsonIgnore]
        public virtual User User { get; set; } = null!;
    }
}
