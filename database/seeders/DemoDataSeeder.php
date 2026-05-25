<?php

namespace Database\Seeders;

use App\Models\CatalogItem;
use App\Models\CompanySetting;
use App\Models\Customer;
use App\Models\Invoice;
use App\Models\Payment;
use App\Models\Quotation;
use App\Models\RecurringSchedule;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

/**
 * Local-only sample data. NEVER run in production.
 * Usage: php artisan db:seed --class=DemoDataSeeder
 */
class DemoDataSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::firstOrCreate(
            ['email' => 'admin@billing.test'],
            [
                'name' => 'Layla Haddad',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );

        CompanySetting::updateOrCreate(
            ['user_id' => $admin->id],
            [
                'company_name' => 'Eloquent Studio FZE',
                'trn' => '100123450000001',
                'trade_license' => 'DMCC-892341',
                'address' => "Office 1402, Sidra Tower\nSheikh Zayed Road, Dubai\nUnited Arab Emirates",
                'email' => 'hello@eloquent.studio',
                'phone' => '+971 4 558 9900',
                'currency' => 'AED',
                'vat_rate' => 5,
                'vat_return_period' => 'quarterly',
                'invoice_prefix' => 'INV-2026-',
                'next_invoice_number' => 149,
                'quotation_prefix' => 'QUO-2026-',
                'next_quotation_number' => 43,
                'payment_terms_days' => 14,
                'late_fee' => '2% per month',
                'footer_note' => 'Thank you for your business. Payment within 14 days. Late payments accrue 2% monthly interest.',
                'accent_color' => '#00ffcc',
                'notify_paid' => true,
                'notify_overdue' => true,
                'auto_remind' => false,
                'bank_name' => 'Emirates NBD',
                'iban' => 'AE07 0260 0010 0987 6543 210',
                'swift' => 'EBILAEAD',
            ]
        );

        $catalog = [
            ['name' => 'Brand identity system', 'price' => 18000, 'unit' => 'project'],
            ['name' => 'Website design (5 pages)', 'price' => 14500, 'unit' => 'project'],
            ['name' => 'Webflow development', 'price' => 9800, 'unit' => 'project'],
            ['name' => 'Monthly retainer — Design', 'price' => 12000, 'unit' => 'month'],
            ['name' => 'Monthly retainer — Content', 'price' => 7500, 'unit' => 'month'],
            ['name' => 'Logo refinement', 'price' => 2400, 'unit' => 'project'],
            ['name' => 'Brand guidelines document', 'price' => 3200, 'unit' => 'doc'],
            ['name' => 'Pitch deck design', 'price' => 4800, 'unit' => 'deck'],
            ['name' => 'Senior designer — hourly', 'price' => 420, 'unit' => 'hour'],
            ['name' => 'Art direction — hourly', 'price' => 560, 'unit' => 'hour'],
            ['name' => 'Photography day rate', 'price' => 3800, 'unit' => 'day'],
            ['name' => 'Motion graphics — 30s', 'price' => 5200, 'unit' => 'spot'],
        ];
        foreach ($catalog as $row) {
            CatalogItem::updateOrCreate(['user_id' => $admin->id, 'name' => $row['name']], $row);
        }

        $customerData = [
            'c1' => ['name' => 'Crescent Media Group', 'contact' => 'Layla Haddad', 'email' => 'finance@crescent.media', 'phone' => '+971 4 558 2210', 'trn' => '100123456700003', 'city' => 'Dubai', 'country' => 'UAE', 'initials' => 'CM', 'customer_since' => '2023-04-12'],
            'c2' => ['name' => 'Atlas Architecture LLC', 'contact' => 'Omar Al-Rashid', 'email' => 'accounts@atlas-arch.ae', 'phone' => '+971 2 441 8800', 'trn' => '100455671200001', 'city' => 'Abu Dhabi', 'country' => 'UAE', 'initials' => 'AA', 'customer_since' => '2022-11-04'],
            'c3' => ['name' => 'Vertex Studio FZE', 'contact' => 'Marina Petrova', 'email' => 'hello@vertexstudio.io', 'phone' => '+971 4 277 9912', 'trn' => '100887766550002', 'city' => 'Dubai', 'country' => 'UAE', 'initials' => 'VS', 'customer_since' => '2024-01-22'],
            'c4' => ['name' => 'Northwind Trading LLC', 'contact' => 'Saeed Hamdan', 'email' => 'ar@northwindtrade.ae', 'phone' => '+971 6 552 3344', 'trn' => '100332211440005', 'city' => 'Sharjah', 'country' => 'UAE', 'initials' => 'NT', 'customer_since' => '2021-08-30'],
            'c5' => ['name' => 'Helix Software DMCC', 'contact' => 'Aisha Naseem', 'email' => 'billing@helix.dev', 'phone' => '+971 4 803 1100', 'trn' => '100776655330001', 'city' => 'Dubai', 'country' => 'UAE', 'initials' => 'HS', 'customer_since' => '2023-09-19'],
            'c6' => ['name' => 'Meridian Logistics', 'contact' => 'Tom Vance', 'email' => 'invoices@meridian-logs.com', 'phone' => '+971 4 660 7788', 'trn' => '100889900110002', 'city' => 'Jebel Ali', 'country' => 'UAE', 'initials' => 'ML', 'customer_since' => '2022-03-08'],
            'c7' => ['name' => 'Lumen Hospitality Group', 'contact' => 'Priya Menon', 'email' => 'finance@lumenhg.ae', 'phone' => '+971 4 326 4400', 'trn' => '100445566770008', 'city' => 'Dubai', 'country' => 'UAE', 'initials' => 'LH', 'customer_since' => '2024-07-01'],
            'c8' => ['name' => 'Orion Capital Partners', 'contact' => 'Khalid Al-Mansouri', 'email' => 'ap@orioncapital.ae', 'phone' => '+971 2 666 1212', 'trn' => '100998877660003', 'city' => 'Abu Dhabi', 'country' => 'UAE', 'initials' => 'OC', 'customer_since' => '2020-12-15'],
        ];

        $customers = [];
        foreach ($customerData as $code => $data) {
            $customers[$code] = Customer::updateOrCreate(
                ['user_id' => $admin->id, 'name' => $data['name']],
                $data + ['user_id' => $admin->id],
            );
        }

        $invoiceRows = [
            ['number' => 'INV-2026-0148', 'cust' => 'c1', 'issue_date' => '2026-05-18', 'due_date' => '2026-06-01', 'status' => 'paid', 'paid_date' => '2026-05-22', 'items' => [['description' => 'Brand identity system — Phase 2', 'qty' => 1, 'price' => 18000], ['description' => 'Brand guidelines document', 'qty' => 1, 'price' => 3200], ['description' => 'Senior designer — hourly', 'qty' => 8, 'price' => 420]], 'notes' => 'Thanks for the continued partnership.'],
            ['number' => 'INV-2026-0147', 'cust' => 'c2', 'issue_date' => '2026-05-14', 'due_date' => '2026-05-28', 'status' => 'sent', 'paid_date' => null, 'items' => [['description' => 'Website design (5 pages)', 'qty' => 1, 'price' => 14500], ['description' => 'Webflow development', 'qty' => 1, 'price' => 9800]], 'notes' => ''],
            ['number' => 'INV-2026-0146', 'cust' => 'c3', 'issue_date' => '2026-04-26', 'due_date' => '2026-05-10', 'status' => 'overdue', 'paid_date' => null, 'items' => [['description' => 'Pitch deck design', 'qty' => 1, 'price' => 4800], ['description' => 'Art direction — hourly', 'qty' => 6, 'price' => 560]], 'notes' => 'Please confirm receipt at your earliest.'],
            ['number' => 'INV-2026-0145', 'cust' => 'c5', 'issue_date' => '2026-05-10', 'due_date' => '2026-05-24', 'status' => 'paid', 'paid_date' => '2026-05-20', 'items' => [['description' => 'Monthly retainer — Design (May)', 'qty' => 1, 'price' => 12000]], 'notes' => ''],
            ['number' => 'INV-2026-0144', 'cust' => 'c4', 'issue_date' => '2026-05-08', 'due_date' => '2026-05-22', 'status' => 'partial', 'paid_date' => null, 'items' => [['description' => 'Logo refinement', 'qty' => 2, 'price' => 2400], ['description' => 'Photography day rate', 'qty' => 3, 'price' => 3800]], 'notes' => 'AED 8,000 received on 2026-05-15.'],
            ['number' => 'INV-2026-0143', 'cust' => 'c6', 'issue_date' => '2026-05-04', 'due_date' => '2026-05-18', 'status' => 'sent', 'paid_date' => null, 'items' => [['description' => 'Motion graphics — 30s', 'qty' => 2, 'price' => 5200], ['description' => 'Senior designer — hourly', 'qty' => 12, 'price' => 420]], 'notes' => ''],
            ['number' => 'INV-2026-0142', 'cust' => 'c7', 'issue_date' => '2026-05-02', 'due_date' => '2026-05-16', 'status' => 'paid', 'paid_date' => '2026-05-09', 'items' => [['description' => 'Brand identity system', 'qty' => 1, 'price' => 18000]], 'notes' => ''],
            ['number' => 'INV-2026-0141', 'cust' => 'c8', 'issue_date' => '2026-04-22', 'due_date' => '2026-05-06', 'status' => 'paid', 'paid_date' => '2026-05-01', 'items' => [['description' => 'Monthly retainer — Design (April)', 'qty' => 1, 'price' => 12000], ['description' => 'Monthly retainer — Content (April)', 'qty' => 1, 'price' => 7500]], 'notes' => ''],
            ['number' => 'INV-2026-0140', 'cust' => 'c2', 'issue_date' => '2026-04-18', 'due_date' => '2026-05-02', 'status' => 'draft', 'paid_date' => null, 'items' => [['description' => 'Pitch deck design', 'qty' => 1, 'price' => 4800]], 'notes' => 'Draft — awaiting scope sign-off.'],
        ];
        $invoices = [];
        foreach ($invoiceRows as $row) {
            $invoices[$row['number']] = Invoice::updateOrCreate(['number' => $row['number']], [
                'user_id' => $admin->id, 'customer_id' => $customers[$row['cust']]->id,
                'issue_date' => $row['issue_date'], 'due_date' => $row['due_date'], 'status' => $row['status'],
                'paid_date' => $row['paid_date'], 'items' => $row['items'], 'tax_rate' => 5, 'notes' => $row['notes'],
            ]);
        }

        $quoteRows = [
            ['number' => 'QUO-2026-0042', 'cust' => 'c3', 'issue_date' => '2026-05-20', 'valid_until' => '2026-06-19', 'status' => 'pending', 'items' => [['description' => 'Brand identity system', 'qty' => 1, 'price' => 18000], ['description' => 'Brand guidelines document', 'qty' => 1, 'price' => 3200], ['description' => 'Pitch deck design', 'qty' => 1, 'price' => 4800]], 'notes' => '50% deposit required to commence.'],
            ['number' => 'QUO-2026-0041', 'cust' => 'c7', 'issue_date' => '2026-05-17', 'valid_until' => '2026-06-16', 'status' => 'accepted', 'items' => [['description' => 'Brand identity system', 'qty' => 1, 'price' => 18000]], 'notes' => ''],
            ['number' => 'QUO-2026-0040', 'cust' => 'c4', 'issue_date' => '2026-05-12', 'valid_until' => '2026-06-11', 'status' => 'pending', 'items' => [['description' => 'Photography day rate', 'qty' => 4, 'price' => 3800], ['description' => 'Motion graphics — 30s', 'qty' => 3, 'price' => 5200]], 'notes' => ''],
            ['number' => 'QUO-2026-0039', 'cust' => 'c1', 'issue_date' => '2026-05-08', 'valid_until' => '2026-06-07', 'status' => 'accepted', 'items' => [['description' => 'Monthly retainer — Design (June+)', 'qty' => 6, 'price' => 12000]], 'notes' => 'Converted to retainer agreement.'],
            ['number' => 'QUO-2026-0038', 'cust' => 'c5', 'issue_date' => '2026-04-30', 'valid_until' => '2026-05-30', 'status' => 'declined', 'items' => [['description' => 'Website design (5 pages)', 'qty' => 1, 'price' => 14500], ['description' => 'Webflow development', 'qty' => 1, 'price' => 9800]], 'notes' => 'Client postponed Q3 launch.'],
            ['number' => 'QUO-2026-0037', 'cust' => 'c6', 'issue_date' => '2026-04-22', 'valid_until' => '2026-05-22', 'status' => 'pending', 'items' => [['description' => 'Brand identity system', 'qty' => 1, 'price' => 18000], ['description' => 'Senior designer — hourly', 'qty' => 24, 'price' => 420]], 'notes' => ''],
        ];
        foreach ($quoteRows as $row) {
            Quotation::updateOrCreate(['number' => $row['number']], [
                'user_id' => $admin->id, 'customer_id' => $customers[$row['cust']]->id,
                'issue_date' => $row['issue_date'], 'valid_until' => $row['valid_until'], 'status' => $row['status'],
                'items' => $row['items'], 'tax_rate' => 5, 'notes' => $row['notes'],
            ]);
        }

        $recRows = [
            ['number' => 'REC-001', 'cust' => 'c5', 'frequency' => 'monthly', 'next_date' => '2026-06-01', 'status' => 'active', 'start_date' => '2024-09-01', 'end_date' => null, 'items' => [['description' => 'Monthly retainer — Design', 'qty' => 1, 'price' => 12000]], 'last_issued' => '2026-05-01', 'sent_count' => 21],
            ['number' => 'REC-002', 'cust' => 'c8', 'frequency' => 'monthly', 'next_date' => '2026-06-01', 'status' => 'active', 'start_date' => '2023-01-01', 'end_date' => null, 'items' => [['description' => 'Monthly retainer — Design', 'qty' => 1, 'price' => 12000], ['description' => 'Monthly retainer — Content', 'qty' => 1, 'price' => 7500]], 'last_issued' => '2026-05-01', 'sent_count' => 41],
            ['number' => 'REC-003', 'cust' => 'c1', 'frequency' => 'monthly', 'next_date' => '2026-06-15', 'status' => 'active', 'start_date' => '2025-06-15', 'end_date' => '2026-12-15', 'items' => [['description' => 'Brand identity system — Phase 2', 'qty' => 1, 'price' => 18000]], 'last_issued' => '2026-05-15', 'sent_count' => 12],
            ['number' => 'REC-004', 'cust' => 'c2', 'frequency' => 'quarterly', 'next_date' => '2026-07-01', 'status' => 'active', 'start_date' => '2025-01-01', 'end_date' => null, 'items' => [['description' => 'Quarterly brand audit', 'qty' => 1, 'price' => 8500]], 'last_issued' => '2026-04-01', 'sent_count' => 6],
            ['number' => 'REC-005', 'cust' => 'c6', 'frequency' => 'monthly', 'next_date' => null, 'status' => 'paused', 'start_date' => '2024-03-01', 'end_date' => null, 'items' => [['description' => 'Monthly retainer — Content', 'qty' => 1, 'price' => 7500]], 'last_issued' => '2026-03-01', 'sent_count' => 14],
        ];
        foreach ($recRows as $row) {
            RecurringSchedule::updateOrCreate(['number' => $row['number']], [
                'user_id' => $admin->id, 'customer_id' => $customers[$row['cust']]->id,
                'frequency' => $row['frequency'], 'next_date' => $row['next_date'], 'status' => $row['status'],
                'start_date' => $row['start_date'], 'end_date' => $row['end_date'],
                'items' => $row['items'], 'tax_rate' => 5,
                'last_issued' => $row['last_issued'], 'sent_count' => $row['sent_count'],
            ]);
        }

        $payRows = [
            ['number' => 'PAY-1042', 'inv' => 'INV-2026-0148', 'cust' => 'c1', 'paid_at' => '2026-05-22', 'amount' => 23310, 'method' => 'Bank transfer', 'reference' => 'ENBD-99821'],
            ['number' => 'PAY-1041', 'inv' => 'INV-2026-0145', 'cust' => 'c5', 'paid_at' => '2026-05-20', 'amount' => 12600, 'method' => 'Bank transfer', 'reference' => 'EI-44219'],
            ['number' => 'PAY-1040', 'inv' => 'INV-2026-0144', 'cust' => 'c4', 'paid_at' => '2026-05-15', 'amount' => 8000, 'method' => 'Cheque', 'reference' => 'CHQ-008871'],
            ['number' => 'PAY-1039', 'inv' => 'INV-2026-0142', 'cust' => 'c7', 'paid_at' => '2026-05-09', 'amount' => 18900, 'method' => 'Card', 'reference' => 'STR_4f...e21'],
            ['number' => 'PAY-1038', 'inv' => 'INV-2026-0141', 'cust' => 'c8', 'paid_at' => '2026-05-01', 'amount' => 20475, 'method' => 'Bank transfer', 'reference' => 'ADIB-77110'],
        ];
        foreach ($payRows as $row) {
            Payment::updateOrCreate(['number' => $row['number']], [
                'user_id' => $admin->id, 'invoice_id' => $invoices[$row['inv']]->id, 'customer_id' => $customers[$row['cust']]->id,
                'paid_at' => $row['paid_at'], 'amount' => $row['amount'], 'method' => $row['method'], 'reference' => $row['reference'],
            ]);
        }
    }
}
