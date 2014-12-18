import psycopg2
import json

##
##
## Small script for generating Mechanical Turk input csv
##
## Most of the work is done in the PostGIS query.  It's 
## computing the intersection of one grid cell from the
## file line_length_grid.geojson (cell ID = 48 in this
## case), and any roads of interest.  Once we have the
## roads within that cell, it generates lat/long points
## along each line as the results of the query.  These
## coordinates are then used to generate Street View 
## links for Mechanical Turk tasks
##

#set up PostGIS connection
conn = psycopg2.connect(host='192.168.59.103', database='gis', user='docker', password='***')
curs = conn.cursor()

query = """WITH road_segments AS (
    SELECT (ST_Dump(ST_Intersection(ST_Transform(roads.way, 3857), ST_SetSRID(grid.geom, 3857)))).geom AS geom 
    FROM planet_osm_line roads, line_lengths_in_grid grid
    WHERE grid.id = 48 AND
    ST_Intersects(ST_Transform(roads.way, 3857), ST_SetSRID(grid.geom, 3857)) AND
    roads.highway IN ('road', 'residential', 'tertiary', 'secondary', 'primary', 'motorway', 'motorway_link')
    )

SELECT ST_AsGeoJson(ST_David_Generate_Points(
    GREATEST(1,(ST_Length(geom)  / 500.0)::integer),
    geom))

FROM road_segments;"""


# header for CSV file
print "Lat,Long,ImageUrl"

curs.execute(query);

for row in curs:
    result = json.JSONDecoder().decode(row[0])
    url_template = "\"http://maps.googleapis.com/maps/api/streetview?size=600x400&location={},{}&fov=120&heading=235&pitch=10&api=AIzaSyAayOw3zE32mgMeW_BkZHo1XxivwxZ9bO8\""
    lat = result["coordinates"][1]
    lng = result["coordinates"][0]
    full_url = url_template.format(lat,lng)
    print "{},{},{}".format(lat,lng,full_url)

curs.close()
conn.close()
