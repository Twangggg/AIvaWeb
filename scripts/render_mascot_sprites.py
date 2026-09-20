"""Bake the chatbot GLB into lightweight, transparent mascot sprite sheets."""

import math
import os
import shutil
import tempfile

import bpy
from mathutils import Vector


ROOT = os.getcwd()
MODEL = os.path.join(ROOT, "public/models/mascot.glb")
OUTPUT = os.path.join(ROOT, "public/mascots")
CELL_SIZE = 384


def look_at(camera, target):
    camera.rotation_euler = (Vector(target) - camera.location).to_track_quat("-Z", "Y").to_euler()


def world_bounds(objects):
    points = []
    for obj in objects:
        if obj.type == "MESH":
            points.extend(obj.matrix_world @ Vector(corner) for corner in obj.bound_box)
    minimum = Vector((min(point[i] for point in points) for i in range(3)))
    maximum = Vector((max(point[i] for point in points) for i in range(3)))
    return minimum, maximum


def render_sheet(camera, center, radius, views, filename):
    tiles = []
    with tempfile.TemporaryDirectory() as temp:
        for index, (yaw, pitch) in enumerate(views):
            yaw = math.radians(yaw)
            pitch = math.radians(pitch)
            # This GLB's face points toward -Y after Blender imports it.
            camera.location = center + Vector((
                math.sin(yaw) * math.cos(pitch) * radius,
                -math.cos(yaw) * math.cos(pitch) * radius,
                math.sin(pitch) * radius,
            ))
            look_at(camera, center)
            tile_path = os.path.join(temp, f"{index}.png")
            bpy.context.scene.render.filepath = tile_path
            bpy.ops.render.render(write_still=True)
            tiles.append(tile_path)

        sheet = bpy.data.images.new("sheet", width=CELL_SIZE * 3, height=CELL_SIZE * 3, alpha=True)
        for index, tile_path in enumerate(tiles):
            tile = bpy.data.images.load(tile_path)
            column, row = index % 3, 2 - index // 3
            for y in range(CELL_SIZE):
                source_start = y * CELL_SIZE * 4
                dest_start = ((row * CELL_SIZE + y) * CELL_SIZE * 3 + column * CELL_SIZE) * 4
                sheet.pixels[dest_start:dest_start + CELL_SIZE * 4] = tile.pixels[source_start:source_start + CELL_SIZE * 4]
            bpy.data.images.remove(tile)
        sheet.filepath_raw = filename
        sheet.file_format = "PNG"
        sheet.save()
        bpy.data.images.remove(sheet)


bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=MODEL)
scene = bpy.context.scene
scene.render.engine = "BLENDER_EEVEE"
scene.render.resolution_x = CELL_SIZE
scene.render.resolution_y = CELL_SIZE
scene.render.resolution_percentage = 100
scene.render.image_settings.file_format = "PNG"
scene.render.film_transparent = True
scene.render.image_settings.color_mode = "RGBA"
scene.render.resolution_percentage = 100
scene.world = bpy.data.worlds.new("MascotWorld")
scene.world.color = (0.055, 0.07, 0.1)

camera_data = bpy.data.cameras.new("MascotCamera")
camera_data.type = "ORTHO"
camera = bpy.data.objects.new("MascotCamera", camera_data)
scene.collection.objects.link(camera)
scene.camera = camera

key_data = bpy.data.lights.new("Key", type="AREA")
key_data.energy = 950
key_data.shape = "DISK"
key_data.size = 4
key = bpy.data.objects.new("Key", key_data)
scene.collection.objects.link(key)
key.location = (3, 4, 5)

fill_data = bpy.data.lights.new("Fill", type="AREA")
fill_data.energy = 450
fill_data.size = 4
fill = bpy.data.objects.new("Fill", fill_data)
scene.collection.objects.link(fill)
fill.location = (-4, 2, 3)

bpy.context.view_layer.update()
minimum, maximum = world_bounds(scene.objects)
center = (minimum + maximum) / 2
height = maximum.z - minimum.z
width = max(maximum.x - minimum.x, maximum.y - minimum.y)
camera_data.ortho_scale = max(height, width) * 1.34
radius = max(height, width) * 2.2

os.makedirs(OUTPUT, exist_ok=True)

# Rows mean up / level / down; columns mean left / centre / right.
directions = [(-34, 14), (0, 14), (34, 14), (-34, 0), (0, 0), (34, 0), (-34, -14), (0, -14), (34, -14)]
directions_path = os.path.join(OUTPUT, "frog-directions.png")
render_sheet(camera, center, radius, directions, directions_path)

# The GLB has no facial blend-shapes, so keep the same transparent atlas for click
# reactions and use a small CSS squash in the button for tactile feedback.
shutil.copyfile(directions_path, os.path.join(OUTPUT, "frog-reactions.png"))
