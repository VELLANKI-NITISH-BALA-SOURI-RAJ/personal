# Import all the necessary modules we just created
import tc_reader
import browser_agent
import ai_validator
import tc_generator
import report_gen
# Import sys to gracefully exit the program
import sys

# Define the function to run the existing test cases and generate the report
def run_existing_tests():
    print("\n--- Step 1: Reading Test Cases ---")
    # Read test cases from the Excel file using our tc_reader module
    test_cases = tc_reader.read_test_cases()
    
    # Check if we actually found any test cases
    if not test_cases:
        print("No test cases found. Please check your Excel file.")
        return
    # Print how many test cases were loaded
    print(f"Loaded {len(test_cases)} test cases.")

    print("\n--- Step 2: Running Browser Automation ---")
    # Run the tests in the browser, which will take screenshots and update the dictionary
    test_cases_with_screenshots = browser_agent.run_all_tests(test_cases)

    print("\n--- Step 3: Validating Screenshots with AI ---")
    # Iterate over each test case that now has a screenshot attached
    for tc in test_cases_with_screenshots:
        # Extract the screenshot path and the expected result string
        screenshot_path = tc.get("screenshot_path")
        expected_result = tc.get("expected")
        
        # Verify the screenshot actually exists before sending to AI
        if screenshot_path and expected_result:
            print(f"Validating {tc['tc_id']}...")
            # Call our AI validator to check the screenshot against the expected result
            validation_result = ai_validator.validate_screenshot(screenshot_path, expected_result)
            
            # Save the status (Pass/Fail) into the test case dictionary
            tc["status"] = validation_result["status"]
            # Save the plain English reason into the test case dictionary
            tc["reason"] = validation_result["reason"]
            
            # Print the outcome for this specific test case
            print(f"Result for {tc['tc_id']}: {tc['status']}")
        else:
            # If screenshot is missing or expected result is empty, mark as Fail automatically
            tc["status"] = "Fail"
            tc["reason"] = "Missing screenshot or expected result."
            print(f"Result for {tc['tc_id']}: {tc['status']} (Missing data)")

    print("\n--- Step 4: Generating HTML Report ---")
    # Pass the fully populated list of test cases to the report generator
    report_gen.generate_html_report(test_cases_with_screenshots)

# Define the main menu loop
def main():
    # Print the welcoming header
    print("=======================================")
    print("        PNA Test Agent Menu            ")
    print("=======================================")
    # Print the options
    print("1. Auto-generate new test cases from live app")
    print("2. Run existing test cases and generate HTML report")
    print("3. Do both (Generate then Run)")
    print("4. Exit")
    print("=======================================")
    
    # Ask the user for their choice
    choice = input("Enter your choice (1-4): ")
    
    # Handle choice 1: Generate only
    if choice == '1':
        print("\nStarting test case generation...")
        tc_generator.generate_test_cases()
        print("\nDone! Check your Excel file.")
        
    # Handle choice 2: Run only
    elif choice == '2':
        run_existing_tests()
        print("\nDone! Check the reports folder.")
        
    # Handle choice 3: Generate then Run
    elif choice == '3':
        print("\nStarting test case generation...")
        tc_generator.generate_test_cases()
        print("\nGeneration complete. Now running all tests...")
        run_existing_tests()
        print("\nDone! Check the reports folder.")
        
    # Handle choice 4: Exit
    elif choice == '4':
        print("Exiting...")
        sys.exit(0)
        
    # Handle invalid input
    else:
        print("Invalid choice. Please run the script again.")

# Standard Python boilerplate to run the main function if executed directly
if __name__ == "__main__":
    main()
