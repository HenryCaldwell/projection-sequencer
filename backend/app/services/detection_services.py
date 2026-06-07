import logging
import threading

import cv2
import numpy as np

from app.schemas.detection_schemas import Marker
from app.services.camera_services import CameraService

logger = logging.getLogger(__name__)

NUM_BEATS = 16
NUM_LANES = 4
MIN_AREA = 500

_TEST_COLORS: list[tuple[str, str, int]] = [
    ("1", "#955952", 25),
    ("2", "#d9742b", 25),
    ("3", "#e6d739", 25),
    ("4", "#5c772e", 25),
    ("5", "#3d85cc", 25),
    ("6", "#1d1d73", 25),
]


def _hex_to_rgb(hex_value: str) -> tuple[int, int, int]:
    hex_value = hex_value.lstrip("#")

    return (
        int(hex_value[0:2], 16),
        int(hex_value[2:4], 16),
        int(hex_value[4:6], 16),
    )


class DetectionService:

    def __init__(self, camera: CameraService) -> None:
        self.camera = camera
        self._colors = _TEST_COLORS
        self._markers: list[Marker] = []
        self._lock = threading.Lock()
        self._thread: threading.Thread | None = None
        self._running = False

    def start(self) -> None:
        self._running = True
        self._thread = threading.Thread(target=self._loop, daemon=True)
        self._thread.start()
        logger.info("Started detection")

    def stop(self) -> None:
        self._running = False

        if self._thread is not None:
            self._thread.join()

        logger.info("Stopped detection")

    def markers(self) -> list[Marker]:
        with self._lock:
            return list(self._markers)

    def _loop(self) -> None:
        while self._running:
            frame = self.camera.read_frame()

            if frame is None:
                continue

            markers = self._detect(frame)

            with self._lock:
                self._markers = markers

    def _detect(self, frame: np.ndarray) -> list[Marker]:
        hsv_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
        frame_h, frame_w = frame.shape[:2]
        markers: list[Marker] = []

        for color_id, hex_value, tolerance in self._colors:
            mask = self._build_mask(hsv_frame, hex_value, tolerance)
            contours, _ = cv2.findContours(
                mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE
            )

            for contour in contours:
                if cv2.contourArea(contour) < MIN_AREA:
                    continue

                x, y, w, h = cv2.boundingRect(contour)
                cx = x + w // 2
                cy = y + h // 2

                lane = min(int((cy / frame_h) * NUM_LANES), NUM_LANES - 1)
                beat = min(int((cx / frame_w) * NUM_BEATS) + 1, NUM_BEATS)

                markers.append(Marker(beat=beat, lane=lane, colorId=color_id))

        return markers

    def _build_mask(
        self, hsv_frame: np.ndarray, hex_value: str, tolerance: int
    ) -> np.ndarray:
        rgb_value = _hex_to_rgb(hex_value)
        hsv_value = cv2.cvtColor(np.uint8([[rgb_value]]), cv2.COLOR_RGB2HSV)[0][0]
        hue, sat, val = int(hsv_value[0]), int(hsv_value[1]), int(hsv_value[2])

        hue_tolerance = tolerance // 4

        hue_lower = hue - hue_tolerance
        hue_upper = hue + hue_tolerance
        sat_lower = max(sat - tolerance, 0)
        sat_upper = min(sat + tolerance, 255)
        val_lower = max(val - tolerance, 0)
        val_upper = min(val + tolerance, 255)

        if hue_lower < 0:
            mask1 = cv2.inRange(
                hsv_frame,
                (0, sat_lower, val_lower),
                (hue_upper, sat_upper, val_upper),
            )
            mask2 = cv2.inRange(
                hsv_frame,
                (180 + hue_lower, sat_lower, val_lower),
                (179, sat_upper, val_upper),
            )
            return mask1 | mask2

        if hue_upper > 179:
            mask1 = cv2.inRange(
                hsv_frame,
                (hue_lower, sat_lower, val_lower),
                (179, sat_upper, val_upper),
            )
            mask2 = cv2.inRange(
                hsv_frame,
                (0, sat_lower, val_lower),
                (hue_upper - 180, sat_upper, val_upper),
            )
            return mask1 | mask2

        return cv2.inRange(
            hsv_frame,
            (hue_lower, sat_lower, val_lower),
            (hue_upper, sat_upper, val_upper),
        )
