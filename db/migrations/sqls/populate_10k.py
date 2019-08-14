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
maxCoorLon = 165.4
minCoorLon = 165.1
maxCoorLat = -14.6
minCoorLat = -14.7

# Open/create file in write mode
f = open('script10k.sql','w+')

# Create 50,000 Reports inside bounds with random values
for i in range(100):
    # Generate random string as ID
    id = randomStringwithDigitsAndSymbols(random.randint(minLen, maxLen))

    # Generate random coordinates
    lat = str(random.uniform(minCoorLat, maxCoorLat))
    lon = str(random.uniform(minCoorLon, maxCoorLon))

    # Generate random type
    rType = str(random.randint(0,8))

    # Write SQL statement to file
    f.write("CALL CreateReport('{id}',{type},'{lon}','{lat}');\n".format(id=id, type=rType, lon=lon, lat=lat))


# Create 50,000 Ads inside bounds with random values
for i in range(100):
    # Generate random string as ID
    id = randomStringwithDigitsAndSymbols(random.randint(minLen, maxLen))

    # Generate random coordinates
    lat = str(random.uniform(minCoorLat, maxCoorLat))
    lon = str(random.uniform(minCoorLon, maxCoorLon))

    # Write SQL statement to file
    f.write("CALL CreateAd('{id}','{lon}','{lat}');\n".format(id=id, lon=lon, lat=lat))

f.close()