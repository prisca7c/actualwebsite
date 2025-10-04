from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
import cv2
import numpy as np
from hand_tracking import HandTracker
from chord_detect import ChordDetector
from match_chord import ChordMatcher
import json
import base64

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

hand_tracker = HandTracker()
chord_detector = ChordDetector()
chord_matcher = ChordMatcher()

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    
    try:
        while True:
            data = await websocket.receive_text()
            frame_data = json.loads(data)
            
            # Decode frame
            frame_bytes = base64.b64decode(frame_data['frame'])
            nparr = np.frombuffer(frame_bytes, np.uint8)
            frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            
            # Process frame
            hand_positions = hand_tracker.detect_hands(frame)
            detected_chord = chord_matcher.match_chord(hand_positions)
            
            # Send results
            await websocket.send_json({
                'detected_chord': detected_chord,
                'hand_positions': hand_positions
            })
            
    except Exception as e:
        print(f"WebSocket error: {e}")
    finally:
        await websocket.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
