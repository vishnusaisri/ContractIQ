from datetime import datetime, date, timedelta
from typing import Optional

def parse_date(date_str: Optional[str]) -> Optional[date]:
    """Parses various date string formats safely."""
    if not date_str or date_str in ["null", "None", "Not specified", ""]:
        return None
    
    date_formats = [
        "%Y-%m-%d",
        "%d/%m/%Y",
        "%m/%d/%Y",
        "%B %d, %Y",
        "%b %d, %Y",
        "%d %B %Y",
        "%d-%m-%Y"
    ]
    
    cleaned = date_str.strip()
    for fmt in date_formats:
        try:
            return datetime.strptime(cleaned, fmt).date()
        except ValueError:
            continue
            
    return None

def calculate_notice_deadline(end_date: Optional[date], notice_period_days: Optional[int]) -> Optional[date]:
    """Calculates notice deadline date before contract end/renewal."""
    if not end_date or not notice_period_days:
        return None
    return end_date - timedelta(days=notice_period_days)
