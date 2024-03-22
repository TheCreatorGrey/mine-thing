from ursina import Ursina, ButtonList, Entity, EditorCamera, color, Func, mouse, destroy, Vec2, scene, PointLight
from ursina.shaders import lit_with_shadows_shader
import json, os, sys

Entity.default_shader = lit_with_shadows_shader

script_dir = os.path.dirname(__file__)
rel_path = "../blockindex.json"
abs_file_path = os.path.join(script_dir, rel_path)

with open(abs_file_path, 'r') as f:
    blockindex = json.loads(f.read())

app = Ursina()
EditorCamera()

plane = Entity(model='plane', scale=5, collider='mesh', y=-.5, color=color.green)
plane.set_shader_input("shadow_color", (0, 0, 0))

selectedType = 'cobble'

def switchBT(type):
    global selectedType
    selectedType = type

buttonIndex = {}
for bt in blockindex:
    buttonIndex[bt] = Func(switchBT, bt)

bl = ButtonList(buttonIndex, font='VeraMono.ttf', button_height=1.5, width=.5, popup=0, clear_selected_on_enable=False, x=-.9)

def input(key):
    if key == "escape":
        sys.exit()
    if key == "e":
        structure = []
        for e in scene.children:
            hasattr(e, 'isBlock')
            if (hasattr(e, 'isBlock')):
                structure.append({'x': round(e.x), 'y': round(e.y), 'z': round(e.z), 'type': e.bltype})
        
        print(structure)

    if key == "right mouse down":
        if (mouse.hovered_entity):
            point = round(mouse.world_point + (mouse.normal*.6))
            
            uvs = blockindex[selectedType]['UV']
            cube = Entity(model='cube', collider='box', position=point, texture='../assets/atlas.png', texture_scale=Vec2(.1, .1), texture_offset=(uvs[0], uvs[1]), bltype=selectedType, isBlock=True)
            cube.set_shader_input("shadow_color", (0, 0, 0))
    if key == "left mouse down":
        if (mouse.hovered_entity and (hasattr(mouse.hovered_entity, 'isBlock'))):
            destroy(mouse.hovered_entity)

app.run()