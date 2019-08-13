import random
import string

def randomStringwithDigitsAndSymbols(stringLength=10):
    """Generate a random string of letters, digits and special characters """
    password_characters = string.ascii_letters + string.digits
    return ''.join(random.choice(password_characters) for i in range(stringLength))

# Declare string lengths
maxLen = 15
minLen = 7

# Declare boundaries in coords
maxCoorLon = 127
minCoorLon = 114
maxCoorLat = 23
minCoorLat = 6

# Open/create file in write mode
f = open('20190813001955-populateDB-up.sql','w+')

# Create 10,000 SQL Insert inside bounds with random values
for i in range(10000):
    # Generate random string as ID
    id = randomStringwithDigitsAndSymbols(random.randint(minLen, maxLen))

    # Generate random coordinates
    lat = str(random.uniform(minCoorLat, maxCoorLat))
    lon = str(random.uniform(minCoorLon, maxCoorLon))

    # Generate random type
    rType = str(random.randint(0,8))

    # Write SQL statement to file
    f.write("CALL CreateReport('{id}',{type},'{lon}','{lat}');\n".format(id=id, type=rType, lon=lon, lat=lat))

# Change boundaries in coords
maxCoorLon = 100
minCoorLon = 70
maxCoorLat = 46
minCoorLat = 29

# Create 10,000 SQL Insert outside bounds with random values
for i in range(10000):
    # Generate random string as ID
    id = randomStringwithDigitsAndSymbols(random.randint(minLen, maxLen))

    # Generate random coordinates
    lat = str(random.uniform(minCoorLat, maxCoorLat))
    lon = str(random.uniform(minCoorLon, maxCoorLon))

    # Generate random type
    rType = str(random.randint(0,8))

    # Write SQL statement to file
    f.write("CALL CreateReport('{id}',{type},'{lon}','{lat}');\n".format(id=id, type=rType, lon=lon, lat=lat))

f.close()