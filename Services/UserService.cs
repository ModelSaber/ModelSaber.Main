using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using ModelSaber.Database;
using ModelSaber.Models;
using ModelSaber.Main.Controllers;
using ModelSaber.Main.Helpers;
// ReSharper disable ConditionIsAlwaysTrueOrFalseAccordingToNullableAPIContract

namespace ModelSaber.Main.Services
{
    public class UserService : IUserService
    {
        private readonly AppSettings _appSettings;
        private readonly ModelSaberDbContext _dbContext;

        public AppSettings AppSettings => _appSettings;

        public UserService(IOptions<AppSettings> appSettings, ModelSaberDbContext dbContext)
        {
            _appSettings = appSettings.Value;
            _dbContext = dbContext;
        }

        public AuthenticateResponse? Authenticate(LoginModel model)
        {
            var users = _dbContext.Users.Include(t => t.Logon).ToList();
            User? user = null;
            if (model.DiscordId.HasValue)
            {
                user = users.FirstOrDefault(t => t.DiscordId == model.DiscordId);
            }
            else
            {
                //TODO add email logic later
            }

            if (user == null)
            {
                if (model.DiscordId.HasValue)
                {
                    // TODO Add new user if using Discord
                }
                return null;
            }

            // ReSharper disable once ConditionIsAlwaysTrueOrFalse
            if(user.Logon != null)
                _dbContext.Logons.Remove(user.Logon);

            var (token, userLogon) = GenerateToken(user, Guid.NewGuid());
            _dbContext.Logons.Add(userLogon);
            _dbContext.SaveChanges();
            return new AuthenticateResponse(user, token);
        }

        public User? GetByGuid(string guid) => GetByGuid(Guid.Parse(guid));

        public User? GetByGuid(Guid guid)
        {
            return _dbContext.Logons.Include(t => t.User).FirstOrDefault(t => t.Id == guid)?.User;
        }

        private (string, UserLogons) GenerateToken(User user, Guid newGuid)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_appSettings.Secret);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[] { new Claim("guid", newGuid.ToString()), new Claim("name", user.Name!), new Claim("discordId", user.DiscordId.ToString()!) }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var securityToken = tokenHandler.CreateToken(tokenDescriptor);
            return (tokenHandler.WriteToken(securityToken), new UserLogons{Id = newGuid, UserId = user.Id, User = user});
        }
    }

    public interface IUserService
    {
        public AppSettings AppSettings { get; }
        public AuthenticateResponse? Authenticate(LoginModel model);
        public User? GetByGuid(string guid);
        public User? GetByGuid(Guid guid);
    }


    public class AuthenticateResponse : User
    {
        public AuthenticateResponse(User user, string token)
        {
            Token = token;
            BSaber = user.BSaber;
            DiscordId = user.DiscordId;
            Id = user.Id;
            Level = user.Level;
            Name = user.Name;
        }

        [JsonIgnore]
        public string Token { get; set; }
    }
}
