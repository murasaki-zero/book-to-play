"""提取指定章节的扫描页，合并来源索引；不覆盖已有图片。需要 pypdf/Pillow。"""
from pathlib import Path
import argparse
import json
import re
from pypdf import PdfReader

PROJECT = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser()
parser.add_argument('--chapters', default='1-4', help='例如 5-7 或 5,7')
parser.add_argument('--source', type=Path, help='明确指定本地 PDF')
parser.add_argument('--pdf-end', type=int, help='末章终页（1-based），需人工核对')
parser.add_argument('--list', action='store_true', help='只列目录，不提取扫描页')
args = parser.parse_args()
files = list(PROJECT.parent.glob('游戏设计艺术*.pdf'))
if not args.source and len(files) != 1:
    raise SystemExit('请使用 --source 指定唯一的原书 PDF。')
source = args.source or files[0]
reader = PdfReader(source)
outline = [item for item in reader.outline if not isinstance(item, list)]
chapters = []
for item in outline:
    match = re.match(r'第\s*(\d+)\s*章\s*(.*)', item.title)
    if match:
        chapters.append({'id': int(match.group(1)), 'title': match.group(2).strip(), 'pdfStart': reader.get_destination_page_number(item) + 1})
chapters.sort(key=lambda c: c['id'])
if args.list:
    for c in chapters:
        print(f"第 {c['id']} 章 · {c['title']} · PDF {c['pdfStart']}")
    raise SystemExit(0)
selected = set()
for part in args.chapters.split(','):
    ends = part.split('-')
    if len(ends) == 1:
        selected.add(int(ends[0]))
    elif len(ends) == 2:
        selected.update(range(int(ends[0]), int(ends[1]) + 1))
    else:
        raise SystemExit('章节格式应为 5-7 或 5,7。')
if not selected or not selected.issubset({c['id'] for c in chapters}):
    raise SystemExit('章节编号不在原书目录中。')
target = PROJECT / 'dist/assets/source'
target.mkdir(parents=True, exist_ok=True)
index_path = PROJECT / 'content/source-pages.json'
existing = json.loads(index_path.read_text()) if index_path.exists() else []
pages = {p['pdfPage']: p for p in existing}
for i, chapter in enumerate(chapters):
    if chapter['id'] not in selected:
        continue
    end = chapters[i+1]['pdfStart'] - 1 if i+1 < len(chapters) else args.pdf_end
    if end is None or end < chapter['pdfStart'] or end > len(reader.pages):
        raise SystemExit('末章需人工核对终页，再用 --pdf-end 指定；不能把附录混入正文。')
    for page in range(chapter['pdfStart'], end+1):
        output = target / f'page-{page}.jpg'
        if not output.exists():
            images = list(reader.pages[page-1].images)
            if not images:
                raise SystemExit(f'PDF {page} 没有内嵌扫描图，请使用 PDF 渲染工具，不要伪造页面。')
            max(images, key=lambda x:len(x.data)).image.convert('RGB').save(output,quality=90)
        pages[page] = {'pdfPage':page,'printedPage':page-48,'chapter':chapter['id'],'image':f'assets/source/page-{page}.jpg'}
    print(f"第 {chapter['id']} 章：PDF {chapter['pdfStart']}—{end}，已有图像保留。")
index_path.write_text(json.dumps(sorted(pages.values(),key=lambda p:p['pdfPage']),ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
