from playwright.sync_api import sync_playwright
from faker import Faker
import random

fake = Faker("en_IN")

with sync_playwright() as p:
    browser = p.chromium.launch(
        headless=False,
        slow_mo=200
    )

    page = browser.new_page()

    # ---------------------------
    # 1. Open landing page
    # ---------------------------
    page.goto("https://demo.automationtesting.in/")

    # Email on landing page
    page.fill("#email", fake.email())

    print("Landing page loaded")

    # Click Register button/image
    page.click("#enterimg")

    page.wait_for_url("**/Register.html")
    print("Register page loaded")

    # ---------------------------
    # 2. Random data
    # ---------------------------
    first_name = fake.first_name()
    last_name = fake.last_name()
    address = fake.address()
    email = fake.email()
    phone = str(random.randint(6000000000, 9999999999))
    password = "Test123"

    # ---------------------------
    # 3. Fill form
    # ---------------------------
    page.fill("input[placeholder='First Name']", first_name)
    page.fill("input[placeholder='Last Name']", last_name)
    page.fill("textarea", address)
    page.fill("input[type='email']", email)
    page.fill("input[type='tel']", phone)

    # Gender
    gender = random.choice(["Male", "FeMale"])
    page.check(f"input[value='{gender}']")

    # Hobbies
    hobbies = ["#checkbox1", "#checkbox2", "#checkbox3"]
    for h in random.sample(hobbies, random.randint(1, 3)):
        page.check(h)

    # ---------------------------
    # 4. Languages
    # ---------------------------
    page.click("#msdd")
    page.click("text=English")
    page.keyboard.press("Escape")

    # ---------------------------
    # 5. Skills
    # ---------------------------
    skills = [
        "Python", "Java", "HTML", "CSS",
        "Javascript", "Android", "SQL"
    ]
    page.select_option("#Skills", random.choice(skills))

    # ---------------------------
    # 6. COUNTRY (FIXED SELECT2 ISSUE)
    # ---------------------------
    country = "India"

    page.locator(".select2-selection").click(force=True)
    page.locator(".select2-search__field").fill(country)
    page.wait_for_timeout(500)
    page.keyboard.press("Enter")

    # ---------------------------
    # 7. DOB
    # ---------------------------
    page.select_option("#yearbox", str(random.randint(1990, 2005)))

    months = [
        "January","February","March","April",
        "May","June","July","August",
        "September","October","November","December"
    ]

    page.select_option(
        "select[ng-model='monthbox']",
        random.choice(months)
    )

    page.select_option("#daybox", str(random.randint(1, 28)))

    # ---------------------------
    # 8. Password
    # ---------------------------
    page.fill("#firstpassword", password)
    page.fill("#secondpassword", password)

    # ---------------------------
    # 9. Screenshot
    # ---------------------------
    page.screenshot(
        path="screenshots/final_form.png",
        full_page=True
    )

    print("Form filled successfully")

    # ---------------------------
    # 10. Submit
    # ---------------------------
    page.click("#submitbtn")

    print("Form submitted successfully")

    page.wait_for_timeout(5000)

    browser.close()