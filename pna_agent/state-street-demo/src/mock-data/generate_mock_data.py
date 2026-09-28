import json
import random

sponsors = [
    {'id': 'SSIAUAT', 'name': 'SSIA UAT Super Sponsor Long Name'},
    {'id': 'UATGRACE', 'name': 'UAT TC Grace Test Sponsor Long'},
] + [{'id': f'UATS{str(i).zfill(4)}', 'name': f'UATS{str(i).zfill(4)} Long Name'} for i in range(1, 50)]

with open('sponsors.json', 'w') as f:
    json.dump(sponsors, f, indent=2)

funds = []
fund_details = {}

types = ['Portfolio', 'Aggregate', 'All']
frequencies = ['Daily', 'Monthly', 'Quarterly']
currencies = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD']
statuses = ['APPROVED', 'UNAPPROVED', 'PENDING']
locks = ['Locked', 'Unlocked']

for i in range(150):
    fund_id = f'113351cyy{str(50 - i if i < 50 else i).zfill(2)}'
    fund_name = f'{fund_id}Long Fund Name Extra Detail'
    
    fund = {
        'fundType': random.choice(types),
        'frequency': random.choice(frequencies),
        'fundId': fund_id,
        'fundName': fund_name,
        'currency': random.choice(currencies),
        'status': random.choice(statuses),
        'lock': random.choice(locks)
    }
    funds.append(fund)
    
    fund_details[fund_id] = {
        'summary': fund,
        'overview': {
            'description': f'Detailed overview for {fund_name}. Strategy involves multi-asset allocation across global markets.',
            'inceptionDate': f'20{random.randint(10, 23)}-{str(random.randint(1,12)).zfill(2)}-{str(random.randint(1,28)).zfill(2)}',
            'totalAssets': f'{random.randint(10, 5000)},{random.randint(100, 999)},000 {fund["currency"]}'
        },
        'performance': [
            {'date': '2023-01-31', 'return': f'{round(random.uniform(-5, 5), 2)}%'},
            {'date': '2023-02-28', 'return': f'{round(random.uniform(-5, 5), 2)}%'},
            {'date': '2023-03-31', 'return': f'{round(random.uniform(-5, 5), 2)}%'},
            {'date': '2023-04-30', 'return': f'{round(random.uniform(-5, 5), 2)}%'},
            {'date': '2023-05-31', 'return': f'{round(random.uniform(-5, 5), 2)}%'}
        ],
        'holdings': [
            {'ticker': 'AAPL', 'name': 'Apple Inc.', 'weight': f'{round(random.uniform(1, 8), 1)}%'},
            {'ticker': 'MSFT', 'name': 'Microsoft Corp.', 'weight': f'{round(random.uniform(1, 8), 1)}%'},
            {'ticker': 'GOOGL', 'name': 'Alphabet Inc.', 'weight': f'{round(random.uniform(1, 5), 1)}%'},
            {'ticker': 'AMZN', 'name': 'Amazon.com Inc.', 'weight': f'{round(random.uniform(1, 5), 1)}%'},
            {'ticker': 'NVDA', 'name': 'NVIDIA Corp.', 'weight': f'{round(random.uniform(0.5, 4), 1)}%'}
        ],
        'audit': [
            {'timestamp': '2023-10-01T10:00:00Z', 'user': 'admin1', 'action': 'Fund created'},
            {'timestamp': '2023-10-02T14:30:00Z', 'user': 'analyst2', 'action': 'Updated performance data'},
            {'timestamp': '2023-10-05T09:15:00Z', 'user': 'auditor1', 'action': 'Reviewed holdings'},
            {'timestamp': '2023-10-10T16:45:00Z', 'user': 'manager1', 'action': f'Fund status set to {fund["status"]}'}
        ]
    }

with open('funds.json', 'w') as f:
    json.dump(funds, f, indent=2)

with open('fundDetails.json', 'w') as f:
    json.dump(fund_details, f, indent=2)
