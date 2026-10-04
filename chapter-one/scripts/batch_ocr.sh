#!/bin/bash
set -e
swift -module-cache-path /tmp/game-stu-swift-cache scripts/ocr-pages.swift dist/assets/source content/chapters-9-10-ocr.json 167-198
swift -module-cache-path /tmp/game-stu-swift-cache scripts/ocr-pages.swift dist/assets/source content/chapters-11-13-ocr.json 199-290
swift -module-cache-path /tmp/game-stu-swift-cache scripts/ocr-pages.swift dist/assets/source content/chapters-14-16-ocr.json 291-350
echo "All OCR batches finished successfully!"
