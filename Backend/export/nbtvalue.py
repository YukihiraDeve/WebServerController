from nbtlib import File
from nbtlib.tag import IntArray

def get_spawn_coordinates(level_dat_path):
    # Charger le fichier level.dat
    level_data = File(level_dat_path)

    # Accéder aux données de la balise 'Data'
    data = level_data.root['Data']

    # Vérifier si 'SpawnX', 'SpawnY', 'SpawnZ' sont dans les données
    spawn_keys = ['SpawnX', 'SpawnY', 'SpawnZ']
    if all(key in data for key in spawn_keys):
        spawn_x = data['SpawnX'].value
        spawn_y = data['SpawnY'].value
        spawn_z = data['SpawnZ'].value
        return spawn_x, spawn_y, spawn_z
    else:
        print("Les coordonnées de spawn par défaut ne sont pas définies dans level.dat.")
        return None

# Chemin vers le fichier level.dat
level_dat_path = 'path/to/your/world/level.dat'

# Obtenir les coordonnées de spawn
spawn_coordinates = get_spawn_coordinates(level_dat_path)

if spawn_coordinates:
    print(f"Coordonnées de spawn: (x={spawn_coordinates[0]}, y={spawn_coordinates[1]}, z={spawn_coordinates[2]})")
else:
    print("Aucune coordonnée de spawn trouvée.")