import os
import sys
import zipfile
import xml.etree.ElementTree as ET
import hashlib

def get_hash(text):
    return hashlib.md5(text.encode('utf-8')).hexdigest()[:12]

def extract_epub_cover(epub_path, out_path):
    try:
        with zipfile.ZipFile(epub_path, 'r') as z:
            opf_path = None
            try:
                container = z.read('META-INF/container.xml')
                root = ET.fromstring(container)
                for rootfile in root.iter('{urn:oasis:names:tc:opendocument:xmlns:container}rootfile'):
                    opf_path = rootfile.attrib.get('full-path')
                    break
            except:
                pass
            
            if not opf_path:
                for name in z.namelist():
                    if name.endswith('.opf'):
                        opf_path = name
                        break
            if not opf_path:
                return False
            
            opf_dir = os.path.dirname(opf_path)
            opf_xml = z.read(opf_path)
            opf_root = ET.fromstring(opf_xml)
            
            cover_href = None
            cover_id = None
            for meta in opf_root.iter('{http://www.idpf.org/2007/opf}meta'):
                if meta.attrib.get('name') == 'cover':
                    cover_id = meta.attrib.get('content')
                    break
            
            for item in opf_root.iter('{http://www.idpf.org/2007/opf}item'):
                item_id = item.attrib.get('id')
                props = item.attrib.get('properties', '')
                if item_id == cover_id or 'cover-image' in props:
                    cover_href = item.attrib.get('href')
                    break
            
            if not cover_href:
                for item in opf_root.iter('{http://www.idpf.org/2007/opf}item'):
                    href = item.attrib.get('href', '').lower()
                    media = item.attrib.get('media-type', '')
                    if 'image' in media and ('cover' in href or 'cover' in item.attrib.get('id', '').lower()):
                        cover_href = item.attrib.get('href')
                        break
                        
            if cover_href:
                full_cover_path = os.path.normpath(os.path.join(opf_dir, cover_href)) if opf_dir else cover_href
                for name in z.namelist():
                    if name == full_cover_path or name.endswith(cover_href):
                        data = z.read(name)
                        with open(out_path, 'wb') as out:
                            out.write(data)
                        return True
    except Exception as e:
        sys.stderr.write(f"EPUB cover extract error {epub_path}: {e}\n")
    return False

def extract_pdf_cover(pdf_path, out_path):
    try:
        with open(pdf_path, 'rb') as f:
            content = f.read(8 * 1024 * 1024) # check first 8MB
        start = content.find(b'\xff\xd8\xff')
        if start != -1:
            end = content.find(b'\xff\xd9', start)
            if end != -1:
                jpg_data = content[start:end+2]
                with open(out_path, 'wb') as out:
                    out.write(jpg_data)
                return True
    except Exception as e:
        sys.stderr.write(f"PDF cover extract error {pdf_path}: {e}\n")
    return False

def sync_covers(book_dir, out_dir):
    os.makedirs(out_dir, exist_ok=True)
    mapping = {}
    for filename in os.listdir(book_dir):
        if filename.startswith('.'):
            continue
        ext = os.path.splitext(filename)[1].lower()
        if ext not in ['.epub', '.pdf']:
            continue
        
        h = get_hash(filename)
        target_name = f"cover-{h}.jpg"
        target_path = os.path.join(out_dir, target_name)
        
        ok = False
        if os.path.exists(target_path) and os.path.getsize(target_path) > 1000:
            ok = True
        else:
            full_book_path = os.path.join(book_dir, filename)
            if ext == '.epub':
                ok = extract_epub_cover(full_book_path, target_path)
            elif ext == '.pdf':
                ok = extract_pdf_cover(full_book_path, target_path)
        
        if ok:
            mapping[filename] = f"/chapter-one/dist/assets/covers/cache/{target_name}"

    return mapping

if __name__ == '__main__':
    root_dir = sys.argv[1] if len(sys.argv) > 1 else '.'
    b_dir = os.path.join(root_dir, 'Book')
    c_dir = os.path.join(root_dir, 'chapter-one/dist/assets/covers/cache')
    res = sync_covers(b_dir, c_dir)
    print(f"Extracted {len(res)} covers.")
