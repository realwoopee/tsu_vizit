using System.Runtime.Serialization;

namespace TSU.Vizit.Domain;

public enum Gender
{
    [EnumMember(Value = "Male")] Male,
    [EnumMember(Value = "Female")] Female
}