from playwright.sync_api import sync_playwright, expect

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            page.goto("http://localhost:3000")

            # Wait for the main heading
            expect(page.get_by_role("heading", name="Tutor Profiles")).to_be_visible()

            # Wait for the list to be populated
            page.wait_for_selector("li")

            # Check for specific tutors
            expect(page.locator("li", has_text="Albert Einstein - Physics")).to_be_visible()
            expect(page.locator("li", has_text="Marie Curie - Chemistry")).to_be_visible()

            page.screenshot(path="jules-scratch/verification/verification.png")
            print("Successfully captured screenshot.")
        except Exception as e:
            print(f"An error occurred: {e}")
            page.screenshot(path="jules-scratch/verification/error.png")
        finally:
            browser.close()

if __name__ == "__main__":
    main()