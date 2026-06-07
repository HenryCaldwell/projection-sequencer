import logging

import cv2
import numpy as np

logger = logging.getLogger(__name__)


class CameraService:

    def __init__(self, device_index: int = 0) -> None:
        self.device_index = device_index
        self._capture: cv2.VideoCapture | None = None

    def start(self) -> None:
        self._capture = cv2.VideoCapture(self.device_index)

        if not self._capture.isOpened():
            raise RuntimeError("Failed to start camera")

        logger.info("Started camera")

    def stop(self) -> None:
        if self._capture is not None:
            self._capture.release()
            self._capture = None
            logger.info("Released camera")

    def read_frame(self) -> np.ndarray | None:
        if self._capture is None:
            raise RuntimeError("Camera not started")

        ret, frame = self._capture.read()

        if not ret:
            logger.warning("Failed to read frame")
            return None

        return frame
