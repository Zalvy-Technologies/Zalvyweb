# ANALYTICS EVENT TAXONOMY
Version: 1.0
Date: 2026-09-15

## Principles
- Privacy-first, minimal collection
- No PII in analytics properties
- Type-safe event definitions
- Server preferred for sensitive events

## Events

### Navigation
page_view
properties: page, referrer_category, device_class

### CTA
cta_click
properties: page, section, cta_name, destination

### Product exploration
solution_view
agent_view
automation_view
platform_view
properties: page, section

### Pricing
pricing_view
pricing_cta_click
properties: page, section, cta_name

### Contact
contact_started
contact_validation_error
contact_submitted
contact_success
contact_failure
properties: page, section

### Verification
verification_started
verification_success
verification_not_found
verification_error
properties: page

### Auth
login_started
login_success
login_failure
logout
properties: page

### Studio / Product
studio_opened
project_created
workflow_created
agent_created
automation_created
generation_started
generation_completed
properties: section

## Acquisition
UTM parameters captured where present
source categories: Direct, Search, Social, Referral, Campaign, Other

## Privacy
Never collect passwords, tokens, API keys, raw prompts, form contents
No tracking of sensitive verification payloads
