import mcworldlib as mc
world = mc.load('test')

for c in world.get_chunks():
    print(c.get_blocks())