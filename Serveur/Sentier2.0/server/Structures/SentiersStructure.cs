using System;
using System.Collections.Generic;

namespace Sentier2._0.Structures
{
    [Serializable]
    public class SentiersStructure
    {
        public List<Zone> zones { get; set; }
        public List<Partner> partners { get; set; }
    }
    [Serializable]
    public class Partner
    { 
        public string name { get; set; }
        public string uri { get; set; }
    }
    [Serializable]
    public class Zone
    {
        public string _id { get; set; }
        public List<Map> maps { get; set; }
    }
    [Serializable]
    public class Map
    {
        public string name { get; set; }
        public string map_file { get; set; }
        public Coordinates topLeftCoordinate { get; set; }
        public Coordinates topRightCoordinate { get; set; }
        public Coordinates bottomLeftCoordinate { get; set; }
        public Coordinates bottomRightCoordinate { get; set; }
        public List<Trail> trails { get; set; }
        public List<InterestPoint> pointsOfInterest { get; set; }
    }
    [Serializable]
    public class Trail
    {
        public string name { get; set; }
        public string description { get; set; }
        public int difficulty { get; set; }
        public List<string> uri { get; set; }
        public bool active { get; set; }
        public string color { get; set; }
        public List<Coordinates> trailCoordinates { get; set; }
    }
    [Serializable]
    public class Coordinates
    {
        public double longitude { get; set; }
        public double latitude { get; set; }
        public double altitude { get; set; }
    }
    [Serializable]
    public class InterestPoint
    {
        public string name { get; set; }
        public string description { get; set; }
        public string type { get; set; }
        public List<string> uri { get; set; }
        public bool active { get; set; }
        public string code { get; set; }
        public Coordinates coordinate { get; set; }
        public List<InterestPointData> data { get; set; }
    }
    [Serializable]
    public class InterestPointData
    {
        public string type { get; set; }
        public string data { get; set; }
    }
}
