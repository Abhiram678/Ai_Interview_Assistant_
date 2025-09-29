import PyPDF2
import docx
import re
import os

class ResumeService:
    def __init__(self):
        self.email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        self.phone_pattern = r'(\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})'
    
    def extract_resume_data(self, file_path):
        """Extract name, email, and phone from resume file"""
        try:
            # Determine file type and extract text
            if file_path.lower().endswith('.pdf'):
                text = self._extract_from_pdf(file_path)
            elif file_path.lower().endswith('.docx'):
                text = self._extract_from_docx(file_path)
            else:
                raise ValueError("Unsupported file format. Please upload PDF or DOCX file.")
            
            # Extract information
            extracted_data = {
                'name': self._extract_name(text),
                'email': self._extract_email(text),
                'phone': self._extract_phone(text),
                'raw_text': text
            }
            
            return extracted_data
        
        except Exception as e:
            raise Exception(f"Error processing resume: {str(e)}")
    
    def _extract_from_pdf(self, file_path):
        """Extract text from PDF file"""
        text = ""
        try:
            with open(file_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                for page in pdf_reader.pages:
                    text += page.extract_text() + "\n"
        except Exception as e:
            raise Exception(f"Error reading PDF: {str(e)}")
        
        return text
    
    def _extract_from_docx(self, file_path):
        """Extract text from DOCX file"""
        try:
            doc = docx.Document(file_path)
            text = ""
            for paragraph in doc.paragraphs:
                text += paragraph.text + "\n"
        except Exception as e:
            raise Exception(f"Error reading DOCX: {str(e)}")
        
        return text
    
    def _extract_name(self, text):
        """Extract name from resume text"""
        lines = text.split('\n')
        for line in lines[:10]:  # Check first 10 lines
            line = line.strip()
            if len(line) > 2 and len(line) < 50:
                # Simple heuristic: first line that looks like a name
                if not any(char.isdigit() for char in line) and '@' not in line:
                    return line
        return ""
    
    def _extract_email(self, text):
        """Extract email from resume text"""
        emails = re.findall(self.email_pattern, text)
        return emails[0] if emails else ""
    
    def _extract_phone(self, text):
        """Extract phone number from resume text"""
        phones = re.findall(self.phone_pattern, text)
        if phones:
            # Format the phone number
            phone = ''.join(phones[0])
            return phone
        return ""
