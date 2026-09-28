from pydantic import BaseModel, Field
from typing import List, Optional

class PageElement(BaseModel):
    element_type: str = Field(description="Type of the element, e.g., 'button', 'input', 'link', 'dropdown'")
    name: Optional[str] = Field(description="The visible text or accessible name of the element", default=None)
    id: Optional[str] = Field(description="The ID attribute of the element", default=None)
    classes: Optional[List[str]] = Field(description="List of CSS classes applied to the element", default_factory=list)
    action: Optional[str] = Field(description="What action this element performs or where it links to", default=None)

class FormInfo(BaseModel):
    form_id: Optional[str] = Field(description="The ID of the form", default=None)
    action: Optional[str] = Field(description="The action URL the form submits to", default=None)
    inputs: List[PageElement] = Field(description="List of input fields within the form", default_factory=list)
    submit_button: Optional[PageElement] = Field(description="The button that submits this form", default=None)

class WebsiteStructure(BaseModel):
    url: str = Field(description="The URL of the analyzed page")
    title: str = Field(description="The title of the page")
    forms: List[FormInfo] = Field(description="List of forms found on the page", default_factory=list)
    interactive_elements: List[PageElement] = Field(description="List of loose interactive elements not part of a form", default_factory=list)
    summary: str = Field(description="A brief AI-generated summary of what this page is for")
