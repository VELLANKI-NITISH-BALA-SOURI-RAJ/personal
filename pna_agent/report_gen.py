# Import os for handling file and directory paths
import os
# Import config for the reports directory
import config
# Import datetime to timestamp our report
from datetime import datetime
# Import image_to_base64 from ai_validator to embed screenshots
from ai_validator import image_to_base64

# Ensure the reports directory exists
os.makedirs(config.REPORTS_DIR, exist_ok=True)

# Define the function to generate the HTML report
def generate_html_report(results):
    # Calculate the total number of test cases run
    total_tests = len(results)
    # Count how many test cases passed
    pass_count = sum(1 for r in results if r.get('status') == 'Pass')
    # Count how many test cases failed
    fail_count = total_tests - pass_count
    
    # Calculate the health percentage (avoid division by zero)
    health_pct = round((pass_count / total_tests * 100) if total_tests > 0 else 0)
    
    # Determine the color of the health badge based on the percentage
    health_color = "green" if health_pct == 100 else ("orange" if health_pct > 50 else "red")
    
    # Generate a timestamp for the report filename
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    # Define the full path for the new HTML report file
    report_path = os.path.join(config.REPORTS_DIR, f"report_{timestamp}.html")
    
    # Start building the HTML string with standard boilerplate and inline CSS styles
    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <title>PNA Test Agent Report</title>
        <style>
            body {{ font-family: Arial, sans-serif; background: #f4f4f9; padding: 20px; }}
            .summary {{ background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-bottom: 20px; }}
            .badge {{ padding: 5px 10px; border-radius: 12px; color: white; font-weight: bold; }}
            .badge-green {{ background: #28a745; }}
            .badge-red {{ background: #dc3545; }}
            .tc-card {{ background: white; padding: 20px; margin-bottom: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }}
            .recommendation {{ background: #fff3cd; color: #856404; padding: 15px; border-left: 5px solid #ffeeba; margin-top: 15px; }}
            img {{ max-width: 100%; border: 1px solid #ddd; margin-top: 10px; border-radius: 4px; }}
        </style>
    </head>
    <body>
        <h1>PNA Test Execution Report</h1>
        
        <div class="summary">
            <h2>Summary</h2>
            <p><strong>Total Tests:</strong> {total_tests}</p>
            <p><strong>Passed:</strong> {pass_count}</p>
            <p><strong>Failed:</strong> {fail_count}</p>
            <p><strong>Health:</strong> <span class="badge" style="background: {health_color}">{health_pct}%</span></p>
        </div>
    """
    
    # Iterate through each result dictionary
    for res in results:
        # Extract fields from the result dictionary
        tc_id = res.get('tc_id', 'Unknown')
        desc = res.get('description', '')
        status = res.get('status', 'Fail')
        reason = res.get('reason', '')
        screenshot_path = res.get('screenshot_path', '')
        
        # Determine the badge class based on the status
        badge_class = "badge-green" if status == 'Pass' else "badge-red"
        
        # Append the test case card HTML
        html += f"""
        <div class="tc-card">
            <h3>{tc_id} <span class="badge {badge_class}">{status}</span></h3>
            <p><strong>Description:</strong> {desc}</p>
            <p><strong>AI Reason:</strong> {reason}</p>
        """
        
        # If the test failed, add a recommendation box explaining what to fix
        if status == 'Fail':
            html += f"""
            <div class="recommendation">
                <strong>Recommendation to Fix:</strong> Review the UI component related to '{desc}'. 
                The AI noted: {reason}. Ensure the DOM elements match the expected state.
            </div>
            """
            
        # If we have a screenshot, embed it as base64
        if screenshot_path and os.path.exists(screenshot_path):
            # Convert the screenshot to a base64 string
            b64_img = image_to_base64(screenshot_path)
            # Embed the image using the data URI scheme
            html += f'<img src="data:image/png;base64,{b64_img}" alt="Screenshot for {tc_id}" />'
            
        # Close the test case card div
        html += "</div>"
        
    # Close the body and html tags
    html += """
    </body>
    </html>
    """
    
    # Open the report file in write mode and encode as UTF-8
    with open(report_path, "w", encoding="utf-8") as f:
        # Write the complete HTML string to the file
        f.write(html)
        
    # Print a success message with the file path
    print(f"Standalone HTML report generated at: {report_path}")