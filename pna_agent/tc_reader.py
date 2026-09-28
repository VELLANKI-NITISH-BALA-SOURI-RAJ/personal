# Import load_workbook from openpyxl to read Excel files
from openpyxl import load_workbook
# Import os to construct file paths
import os
# Import config for file paths
import config

# Define a function to read test cases from the Excel file
def read_test_cases():
    # Construct the full path to the Excel file
    file_path = config.TC_FILE
    
    # Check if the file actually exists
    if not os.path.exists(file_path):
        # Print a warning if it doesn't exist
        print(f"Warning: {file_path} not found. Returning empty list.")
        # Return an empty list to avoid crashing
        return []

    # Load the workbook from the file path
    wb = load_workbook(filename=file_path, data_only=True)
    # Get the active (first) sheet from the workbook
    sheet = wb.active

    # Create an empty list to store the extracted test cases
    test_cases = []
    
    # Get all rows from the sheet starting from the second row (skipping headers)
    # We assume headers are in the first row
    for row in sheet.iter_rows(min_row=2, values_only=True):
        # Unpack the row values into variables based on the expected columns
        # Columns: Scenario ID, Testcase ID, Testcase Description, Pre-Condition, Step Action, Step Expected Result
        scenario_id, tc_id, description, pre_condition, step_action, expected = row[:6]
        
        # Skip rows where the testcase ID is missing (empty rows)
        if not tc_id:
            continue
            
        # Create a dictionary mapping the variables to specific keys
        tc_dict = {
            "scenario_id": scenario_id,       # Add Scenario ID
            "tc_id": tc_id,                   # Add Testcase ID
            "description": description,       # Add Testcase Description
            "pre_condition": pre_condition,   # Add Pre-Condition
            "step_action": step_action,       # Add Step Action
            "expected": expected              # Add Step Expected Result
        }
        # Append the dictionary to our list of test cases
        test_cases.append(tc_dict)

    # Return the fully populated list of test cases
    return test_cases