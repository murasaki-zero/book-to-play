#!/bin/bash
set -e
swift -module-cache-path /tmp/game-stu-swift-cache scripts/ocr-pages.swift dist/assets/source content/chapters-17-22-ocr.json 351-450
swift -module-cache-path /tmp/game-stu-swift-cache scripts/ocr-pages.swift dist/assets/source content/chapters-23-28-ocr.json 451-526
swift -module-cache-path /tmp/game-stu-swift-cache scripts/ocr-pages.swift dist/assets/source content/chapters-29-34-ocr.json 527-594
echo "All remaining OCR batches completed!"
