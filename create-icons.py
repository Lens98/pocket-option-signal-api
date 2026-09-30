from PIL import Image, ImageDraw, ImageFont
import os

sizes = [16, 32, 48, 128]

output_dir = r"chrome-extension\public\icons"
os.makedirs(output_dir, exist_ok=True)

for size in sizes:
    img = Image.new("RGBA", (size, size), (79, 70, 229, 255))
    draw = ImageDraw.Draw(img)

    # Rounded purple/indigo background
    radius = max(3, size // 5)
    draw.rounded_rectangle(
        (0, 0, size - 1, size - 1),
        radius=radius,
        fill=(79, 70, 229, 255)
    )

    # White S logo
    font_size = int(size * 0.68)

    try:
        font = ImageFont.truetype(
            "C:/Windows/Fonts/arialbd.ttf",
            font_size
        )
    except:
        font = ImageFont.load_default()

    text = "S"
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]

    x = (size - text_width) / 2 - bbox[0]
    y = (size - text_height) / 2 - bbox[1]

    draw.text(
        (x, y),
        text,
        font=font,
        fill=(255, 255, 255, 255)
    )

    img.save(
        os.path.join(output_dir, f"icon{size}.png"),
        "PNG"
    )

print("SignalForge AI icons created successfully.")