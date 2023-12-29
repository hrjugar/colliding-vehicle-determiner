from ultralytics import YOLO
import os
import sys
import json

if (__name__ == '__main__'):
    frame_folder_path = sys.argv[1]
    output_folder_path = sys.argv[2]

    model = YOLO("best.pt")

    frame_count = len(os.listdir(frame_folder_path))
    frames_output = []

    for i in range(1, frame_count + 1):
        frame_path = os.path.join(frame_folder_path, f"{i}.png")
        result = model.predict(frame_path, save=False, save_txt=False)[0]

        frame_output = []
        
        if len(result.boxes) > 0:
            for j, box in enumerate(result.boxes):
                x, y, w, h = box.xywhn.tolist()[0]
                confidence = box.conf.item()
                frame_output.append({
                    "x": x,
                    "y": y,
                    "w": w,
                    "h": h,
                    "confidence": confidence
                })
        
        frames_output.append(frame_output)
    
    output_file_path = os.path.join(output_folder_path, "accident-detection-output.json")
    with open(output_file_path, "w") as f:
        json.dump(frames_output, f)
        
    
