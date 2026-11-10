-- FinPilot AI seed data (demo/educational). Safe for free-tier/local dev.
-- Run after migrations. Uses fixed UUIDs for idempotency where possible.

insert into public.loan_products (id, name, description, category, is_active)
values
  ('11111111-1111-4111-8111-111111111111', 'Personal Loan', 'Commonly used for personal expenses; terms vary by lender.', 'Personal Loan', true),
  ('22222222-2222-4222-8222-222222222222', 'Home Loan', 'Typically used for property purchase/construction; often secured.', 'Home Loan', true),
  ('33333333-3333-4333-8333-333333333333', 'Education Loan', 'Supports education-related expenses; policies vary.', 'Education Loan', true),
  ('44444444-4444-4444-8444-444444444444', 'Vehicle Loan', 'Used to purchase a vehicle; often asset-backed.', 'Vehicle Loan', true),
  ('55555555-5555-4555-8555-555555555555', 'Secured Loan', 'Backed by collateral; requirements vary by lender.', 'Secured Loan', true),
  ('66666666-6666-4666-8666-666666666666', 'Unsecured Loan', 'No collateral; eligibility and terms vary.', 'Unsecured Loan', true)
on conflict (id) do update set name=excluded.name, description=excluded.description, category=excluded.category, is_active=excluded.is_active;

insert into public.knowledge_documents (id, title, content, source, status)
values
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1', 'What is EMI?',
   'EMI (Equated Monthly Installment) is a fixed monthly payment used to repay a loan over a specified tenure. It typically includes both principal and interest components. A common reducing-balance formula is: EMI = P × r × (1+r)^n / ((1+r)^n − 1), where P is principal, r is monthly interest rate, and n is number of months. If the interest rate is 0%, EMI = P / n. Actual lender calculations, fees, and terms may vary. This is educational information only, not a lender quotation or offer.',
   'FinPilot Verified Knowledge Base', 'published'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2', 'Secured vs Unsecured Loans',
   'Secured loans are typically backed by collateral (such as property or a vehicle), which may reduce lender risk. Unsecured loans generally do not require collateral and may rely more on factors like credit profile and income. Eligibility, interest rates, fees, and terms vary by lender and individual circumstances. This is general educational guidance, not lender-specific policy.',
   'FinPilot Verified Knowledge Base', 'published'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa3', 'Common Documentation Categories',
   'Financial institutions may request different documentation depending on the product and their policies. Common categories include: identity verification information, address verification information, income information, employment information, and other lender-specific documentation. Requirements vary by institution and jurisdiction. FinPilot AI does not collect real Aadhaar, PAN, bank credentials, or actual identity documents in the MVP; use sample data only.',
   'FinPilot Verified Knowledge Base', 'published'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa4', 'Interest Rates (Educational)',
   'An interest rate is the cost of borrowing money, often expressed as an annual percentage rate. Rates can be influenced by lender policy, market conditions, loan type, tenure, and borrower profile. FinPilot AI does not invent or quote specific lender interest rates, fees, or approval terms. For actual rates, consult official lender information.',
   'FinPilot Verified Knowledge Base', 'published'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa5', 'Typical Application Stages',
   'While processes vary by lender, common stages may include: learning about options, preparing information, submitting an application to a lender, verification/review, and receiving an outcome decision from the lender. Timelines and requirements differ. FinPilot AI provides educational guidance and simulated demo tracking only; it does not submit real applications to banks or lenders and does not make approval decisions.',
   'FinPilot Verified Knowledge Base', 'published')
on conflict (id) do update set title=excluded.title, content=excluded.content, source=excluded.source, status=excluded.status;

-- Note: Admin accounts must be created via a trusted administrative process (e.g. Supabase dashboard/service role),
-- then the corresponding profiles.role set to 'admin'. Do NOT create or promote admins via public registration.
-- After creating an admin auth user, run (as privileged SQL):
-- update public.profiles set role = 'admin' where id = '<admin-user-uuid>';
-- insert into public.audit_logs (actor_id, action, entity_type, entity_id) values ('<admin-user-uuid>', 'ADMIN_PROVISIONED', 'profile', '<admin-user-uuid>');
