import Foundation
import Vision
import ImageIO

let args = CommandLine.arguments
if args.count != 4 { print("usage: ocr-pages.swift image-dir output-file page-range"); exit(1) }
let dir = args[1], output = args[2]
let bounds = args[3].split(separator: "-").compactMap { Int($0) }
var records: [[String: Any]] = []
for page in bounds[0]...bounds[1] {
    autoreleasepool {
        let url = URL(fileURLWithPath: "\(dir)/page-\(page).jpg")
        let request = VNRecognizeTextRequest()
        request.recognitionLevel = .accurate
        request.recognitionLanguages = ["zh-Hans", "en-US"]
        request.usesLanguageCorrection = true
        do {
            try VNImageRequestHandler(url: url).perform([request])
            let text = (request.results ?? []).compactMap { $0.topCandidates(1).first?.string }.joined(separator: "\n")
            records.append(["pdfPage": page, "text": text])
            print("OCR \(page): \(text.count) characters")
        } catch { records.append(["pdfPage": page, "error": error.localizedDescription]) }
    }
}
try JSONSerialization.data(withJSONObject: records, options: [.prettyPrinted, .sortedKeys]).write(to: URL(fileURLWithPath: output))
