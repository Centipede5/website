import requests
from bs4 import BeautifulSoup
from markdownify import markdownify as md

def generate_llms_txt(url="http://127.0.0.1:4000/"):
    try:
        response = requests.get(url)
        response.raise_for_status()
        html_content = response.text
        
        soup = BeautifulSoup(html_content, 'html.parser')
        
        # Remove noisy elements like scripts, styles, and empty SVGs
        for element in soup(["script", "style", "svg", "nav", "footer"]):
            element.decompose()
            
        # Try to find the main content block, otherwise use body
        main_content = soup.find('main')
        if not main_content:
            main_content = soup.find('body')
            
        if not main_content:
            print("Could not find main or body element.")
            return

        # Convert to markdown
        markdown_text = md(str(main_content), heading_style="ATX", bypass_tables=False)
        
        # Clean up excessive newlines
        lines = markdown_text.split('\n')
        clean_lines = []
        blanks = 0
        for line in lines:
            if not line.strip():
                blanks += 1
                if blanks > 2:
                    continue
            else:
                blanks = 0
            clean_lines.append(line)
            
        final_markdown = "\n".join(clean_lines).strip()
        
        # Prepend standard llms.txt header
        header = "# Calvin Ristad - Software and AI Engineer\n\n> This file provides an LLM-friendly overview of my portfolio and background.\n\n"
        final_markdown = header + final_markdown

        with open("llms.txt", "w", encoding="utf-8") as f:
            f.write(final_markdown)
            
        print("Successfully generated llms.txt!")
        
    except Exception as e:
        print(f"Error generating llms.txt: {e}")

if __name__ == "__main__":
    generate_llms_txt()
