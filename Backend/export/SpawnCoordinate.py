import os
import sys
from nbt import nbt

def get_player_spawn_coordinates_from_playerdata(nbt_file):
    spawn_x = nbt_file.get("SpawnX")
    spawn_y = nbt_file.get("SpawnY")
    spawn_z = nbt_file.get("SpawnZ")

    if spawn_x and spawn_y and spawn_z:
        return spawn_x.value, spawn_y.value, spawn_z.value
    else:
        return None, None, None

def main(playerdata_path):
    # Assuming there is only one player file, or you target a specific one.
    for filename in os.listdir(playerdata_path):
        if filename.endswith(".dat"):
            full_path = os.path.join(playerdata_path, filename)
            nbt_file = nbt.NBTFile(full_path, 'rb')
            spawn_x, spawn_y, spawn_z = get_player_spawn_coordinates_from_playerdata(nbt_file)
            if spawn_x is not None and spawn_y is not None and spawn_z is not None:
                print(spawn_x, spawn_y, spawn_z)
                return
    print("No spawn coordinates found", file=sys.stderr)

if __name__ == '__main__':
    if len(sys.argv) != 2:
        print("Usage: python get_spawn_coordinates.py <playerdata directory>", file=sys.stderr)
        sys.exit(1)
    
    playerdata_directory = sys.argv[1]
    main(playerdata_directory)