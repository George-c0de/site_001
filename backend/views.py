import io
import logging
import json
import xlsxwriter
from django.contrib.auth import logout, authenticate, login
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.http import HttpResponse, FileResponse
from django.shortcuts import render, redirect
from django.contrib import messages
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth.models import User
from decimal import *
from .forms import CreateUserForm
from .models import Profile, Matrix, User_in_Matrix, Wallet, Transaction, Category_Bronze, Admin, All, First_Line, \
    Second_Line, Third_Line
from .serializers import ProfileSerializer
from tronpy import Contract, Tron
import base58
from tronpy.keys import PrivateKey
from tronpy.providers import HTTPProvider
import requests

# Лог выводим на экран и в файл
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.FileHandler("debug.log"),
        logging.StreamHandler()
    ]
)
if not Profile.objects.filter(admin_or=True).exists():
    user = User()
    user.username = 'admin'
    user.password = 'admin'
    user.save()
    profile2 = Profile()
    profile2.user = user
    profile2.save()

admin_ = Profile.objects.filter(admin_or=True).first()
if not All.objects.all().exists():
    a = All()
    a.save()


def index(request):
    return render(request, 'backend/index.html')


def import_users(request):
    output = io.BytesIO()
    workbook = xlsxwriter.Workbook(output)
    worksheet = workbook.add_worksheet()
    all_user = Profile.objects.all()
    worksheet.write(0, 0, 'Имя')
    worksheet.write(0, 1, 'Email')
    worksheet.write(0, 2, 'UTM личная')
    worksheet.write(0, 3, 'Полученная прибыль с рефералов')
    worksheet.write(0, 4, 'Упущено')
    worksheet.write(0, 5, 'Кошелек')
    worksheet.write(0, 6, 'Максимальная купленная карта')
    worksheet.write(0, 7, 'Деньги')
    i = 1
    for el in all_user:
        j = 0
        worksheet.write(i, j, el.user.username)
        j += 1
        if el.user.email == '':
            worksheet.write(i, j, 'не указано')
        else:
            worksheet.write(i, j, el.user.email)
        j += 1
        worksheet.write(i, j, el.referral_link)
        j += 1

        worksheet.write(i, j, el.referral_amount)
        j += 1
        worksheet.write(i, j, el.missed_amount)
        j += 1
        if el.wallet is None:
            worksheet.write(i, j, 'Не указано')
        else:
            worksheet.write(i, j, el.wallet)
        j += 1
        if el.max_card is None:
            worksheet.write(i, j, 'Не было куплено ни одной карты')
        else:
            worksheet.write(i, j, el.max_card)
        j += 1
        worksheet.write(i, j, el.money)
        i += 1
    # output.seek(0)
    workbook.close()
    xlsx_data = output.getvalue()
    response = HttpResponse(content_type='application/vnd.ms-excel')
    response['Content-Disposition'] = 'attachment; filename=Users.xlsx'
    response.write(xlsx_data)
    return response


def index_with_utm(request, utm):
    a = Response()
    # request.session
    a.set_cookie('utm', utm)
    return Response(request.COOKIES['utm'])


@api_view(['GET', 'POST'])
def login_page(request):
    if request.user.is_authenticated:
        return redirect('home')
    else:
        if request.method == 'POST':
            username = request.POST.get('username')
            password = request.POST.get('password')
            user = authenticate(request, username=username, password=password)
            if user is not None:
                login(request, user)
                return redirect('home')
            else:
                messages.info(request, 'имя пользователя и пароль неверный.')
        context = {}
        return render(request, 'backend/login.html', context)


def logout_user(request):
    logout(request)
    return redirect('login')


def register_page(request):
    form = CreateUserForm()
    if request.method == 'POST':
        form = CreateUserForm(request.POST)
        if form.is_valid():
            form.save()
            username = form.cleaned_data.get('username')
            user = User.objects.get(username=username)
            messages.success(request, 'Аккаунт создан,' + username)
            return redirect('home')

    context = {'form': form}
    return render(request, 'backend/register.html', context)


def referral_system_bronze1(request):
    profile = Profile.objects.get(user__id=request.user.id)
    all_ = All.objects.all().first()
    if request.COOKIES.get('utm'):
        cokies = 0
        main_user = 0
    else:
        cookies = request.COOKIES['utm']
        main_user = Profile.objects.get(referral_link=cookies)
    context = {
        'admin': admin_,
        'profile': profile,
        'all': all_,
        'main_user': main_user

    }
    # utm = profile.referral_link
    # response = render(request, 'backend/ref.html')
    # response.set_cookie(key='utm', value=utm)
    # return response
    #
    # html = Response('Hello')
    # utm = profile.referral_link
    # html.set_cookie('utm', utm, max_age=None)
    # return html
    return render(request, 'backend/ref.html', context=context)


# Логика реферальной системы
def referral_system_bronze(request, id_):
    profile = Profile.objects.get(user__id=request.user.id)
    card = 'card_' + str(id_)
    all_ = All.objects.all().first()
    cookies = request.COOKIES['utm']
    main_user = Profile.objects.get(referral_link=cookies)
    # Пятый случай
    max_card_ = '0' + str(id_)

    if Category_Bronze.objects.filter(user__id=profile.id).exists():
        category_bronze = Category_Bronze.objects.get(user__id=profile.id)
    else:
        category_bronze = Category_Bronze()
        category_bronze.user = profile
    if id_ == 6 and category_bronze.card_6_disable is False:
        return HttpResponse('Error')
    else:
        if card == 'card_1':
            money_to_card = category_bronze.card_1
        elif card == 'card_2':
            money_to_card = category_bronze.card_2
        elif card == 'card_3':
            money_to_card = category_bronze.card_3
        elif card == 'card_4':
            money_to_card = category_bronze.card_4
        elif card == 'card_5':
            money_to_card = category_bronze.card_5
        else:
            money_to_card = category_bronze.card_6
    money_to_card = Decimal(money_to_card)
    if profile.money < money_to_card:
        return HttpResponse('Error')
    if main_user.max_card < int(max_card_):
        if First_Line.objects.filter(main_user__id=admin_.id):
            line_admin = First_Line.objects.get(main_user__id=admin_.id)
            profile.line_1 = line_admin.id
            line_admin.save()
        else:
            line_admin = First_Line()
            line_admin.main_user = admin_
            profile.line_1 = line_admin.id
            line_admin.save()
    # Второй случай
    if cookies is None or cookies == '':
        admin_.money += money_to_card * Decimal(0.15)
        profile.money -= money_to_card
        all_.money += money_to_card * Decimal(0.85)
    # третий случай

    second_line = False
    third_line = False
    if Second_Line.objects.filter(main_user__user__id=main_user.id).exists():
        second_line = True
    if Third_Line.objects.filter(main_user__user__id=main_user.id).exists():
        third_line = True
    if not second_line and not third_line:
        admin_.money += money_to_card * Decimal(0.05)
        main_user.money += money_to_card * Decimal(0.1)
        all_.money += money_to_card * Decimal(0.85)
        profile.money -= money_to_card
    # четвертый случай
    if not third_line:
        admin_.money += money_to_card * Decimal(0.01)
        profile.money -= money_to_card
        main_user.money += money_to_card * Decimal(0.1)
        all_.money += money_to_card * Decimal(0.85)
    else:
        profile.money -= money_to_card
        main_user.money += money_to_card * Decimal(0.1)
        all_.money += money_to_card * Decimal(0.9)
    category_bronze.save()
    admin_.save()
    main_user.save()
    all_.save()
    profile.save()
    context = {
        'admin': admin_,
        'profile': profile,
        'all': all_,
        'main_user': main_user
    }
    return render(request, 'backend/ref.html', context=context)

    # проверка на рефку
    # else:
    # a = Admin.objects.all().first()
    # b =
    # if Category_Bronze.objects.filter(user.id=).exists()


# Логика матрицы
def logics_matrix(request):
    if Matrix.objects.all().count() != 0:
        if Matrix.objects.all().count() == 1:
            all_Matrix = Matrix.objects.all().first()
            main_matrix = all_Matrix
            if main_matrix.col == 4:
                new_matrix = Matrix()
                new_matrix.max_users = main_matrix.max_users * 2
                main_matrix.up = True
                new_user_in_matrix = User_in_Matrix()
                new_user_in_matrix.participant_number = 4
                new_user_in_matrix.matrix = new_matrix
                new_user_in_matrix.user = request.user
                new_matrix.save()
                new_user_in_matrix.save()
                # Вставить моудли зачисления дял предыдущих игроко, а также
                # реферальную систему
            else:
                new_user_in_matrix = User_in_Matrix()
                new_user_in_matrix.participant_number = main_matrix.col
                new_user_in_matrix.user = request.user
                main_matrix.col += 1
                main_matrix.save()
                new_user_in_matrix.matrix = main_matrix
                new_user_in_matrix.save()
        else:
            pass
            # Оснорвной модуль
    else:
        pass
        # Модуль создание первой матрицы


# Модуль оплаты

# Класс оплаты
# Service function for working wit USDT contract
def address_to_parameter(addr):
    return "0" * 24 + base58.b58decode_check(addr)[1:].hex()


def amount_to_parameter(amount):
    return '%064x' % amount


# USDT contract interface
usdt_abi = [{"inputs": [{"name": "name_", "type": "string"}, {"name": "symbol_", "type": "string"}],
             "stateMutability": "Nonpayable", "type": "Constructor"}, {
                "inputs": [{"indexed": True, "name": "owner", "type": "address"},
                           {"indexed": True, "name": "spender", "type": "address"},
                           {"name": "value", "type": "uint256"}], "name": "Approval", "type": "Event"}, {
                "inputs": [{"name": "userAddress", "type": "address"},
                           {"name": "relayerAddress", "type": "address"},
                           {"name": "functionSignature", "type": "bytes"}], "name": "MetaTransactionExecuted",
                "type": "Event"}, {"inputs": [{"indexed": True, "name": "previousOwner", "type": "address"},
                                              {"indexed": True, "name": "newOwner", "type": "address"}],
                                   "name": "OwnershipTransferred", "type": "Event"}, {
                "inputs": [{"indexed": True, "name": "from", "type": "address"},
                           {"indexed": True, "name": "to", "type": "address"},
                           {"name": "value", "type": "uint256"}],
                "name": "Transfer", "type": "Event"},
            {"outputs": [{"type": "string"}], "name": "ERC712_VERSION", "stateMutability": "View",
             "type": "Function"},
            {"outputs": [{"type": "uint256"}],
             "inputs": [{"name": "owner", "type": "address"}, {"name": "spender", "type": "address"}],
             "name": "allowance", "stateMutability": "View", "type": "Function"}, {"outputs": [{"type": "bool"}],
                                                                                   "inputs": [{"name": "spender",
                                                                                               "type": "address"},
                                                                                              {"name": "amount",
                                                                                               "type": "uint256"}],
                                                                                   "name": "approve",
                                                                                   "stateMutability": "Nonpayable",
                                                                                   "type": "Function"},
            {"outputs": [{"type": "uint256"}], "inputs": [{"name": "account", "type": "address"}],
             "name": "balanceOf",
             "stateMutability": "View", "type": "Function"},
            {"outputs": [{"type": "uint8"}], "name": "decimals", "stateMutability": "View", "type": "Function"},
            {"outputs": [{"type": "bool"}],
             "inputs": [{"name": "spender", "type": "address"}, {"name": "subtractedValue", "type": "uint256"}],
             "name": "decreaseAllowance", "stateMutability": "Nonpayable", "type": "Function"},
            {"outputs": [{"type": "bytes"}],
             "inputs": [{"name": "userAddress", "type": "address"}, {"name": "functionSignature", "type": "bytes"},
                        {"name": "sigR", "type": "bytes32"}, {"name": "sigS", "type": "bytes32"},
                        {"name": "sigV", "type": "uint8"}], "name": "executeMetaTransaction",
             "stateMutability": "Payable", "type": "Function"},
            {"outputs": [{"type": "uint256"}], "name": "getChainId", "stateMutability": "Pure", "type": "Function"},
            {"outputs": [{"type": "bytes32"}], "name": "getDomainSeperator", "stateMutability": "View",
             "type": "Function"},
            {"outputs": [{"name": "nonce", "type": "uint256"}], "inputs": [{"name": "user", "type": "address"}],
             "name": "getNonce", "stateMutability": "View", "type": "Function"}, {"outputs": [{"type": "bool"}],
                                                                                  "inputs": [{"name": "spender",
                                                                                              "type": "address"},
                                                                                             {"name": "addedValue",
                                                                                              "type": "uint256"}],
                                                                                  "name": "increaseAllowance",
                                                                                  "stateMutability": "Nonpayable",
                                                                                  "type": "Function"},
            {"inputs": [{"name": "amount", "type": "uint256"}], "name": "mint", "stateMutability": "Nonpayable",
             "type": "Function"},
            {"outputs": [{"type": "string"}], "name": "name", "stateMutability": "View", "type": "Function"},
            {"outputs": [{"type": "address"}], "name": "owner", "stateMutability": "View", "type": "Function"},
            {"name": "renounceOwnership", "stateMutability": "Nonpayable", "type": "Function"},
            {"outputs": [{"type": "string"}], "name": "symbol", "stateMutability": "View", "type": "Function"},
            {"outputs": [{"type": "uint256"}], "name": "totalSupply", "stateMutability": "View",
             "type": "Function"},
            {"outputs": [{"type": "bool"}],
             "inputs": [{"name": "recipient", "type": "address"}, {"name": "amount", "type": "uint256"}],
             "name": "transfer", "stateMutability": "Nonpayable", "type": "Function"},
            {"outputs": [{"type": "bool"}],
             "inputs": [{"name": "sender",
                         "type": "address"},
                        {"name": "recipient",
                         "type": "address"},
                        {"name": "amount",
                         "type": "uint256"}],
             "name": "transferFrom",
             "stateMutability": "Nonpayable",
             "type": "Function"},
            {"inputs": [{"name": "newOwner", "type": "address"}], "name": "transferOwnership",
             "stateMutability": "Nonpayable", "type": "Function"}]


# Main Class
class TronClient:
    """TRON API Client
    """

    def __init__(self, config=False):
        """class initialization

        Args:
            config (optional): app config object, defaults to nile testnet
        """
        if not config or config == {}:
            self.tron_url = "https://api.nileex.io"
            self.trongrid_url = 'https://nile.trongrid.io'
            self.usdt_address = "TXLAQ63Xg1NAzckPwKHvzw7CSEmLMEqcdj"
            self.fee_limit = 20000000
            self.api_key = 'f1870c5e-191b-406e-8531-070d9c8ec425'

        else:
            self.tron_url = config['TRON_URL']
            self.usdt_address = config['USDT_CONTRACT_ADDRESS']
            self.fee_limit = config['DEFAULT_FEE_LIMIT']
            self.api_key = config['API_KEY']
        try:
            self.client = Tron(HTTPProvider(self.tron_url, api_key=self.api_key))
            # self.client = Tron(network='nile', api_key=self.api_key)
            self.usdt_contract = self.client.get_contract(str(self.usdt_address))
        except Exception as e:
            print('Error Tron initialization', str(e))
        else:
            pass

    def is_address(self, address: str) -> bool:
        """Check if string if valid TRON address

        Args:
            address (str): address

        Returns:
            bool : valid address or not
        """
        return address and self.client.is_address(address)

    def create_wallet(self) -> dict:
        """Generate new wallet

        Returns:
            dict : wallet private and public keys
        """

        wallet = self.client.generate_address()
        return wallet

    def trx_balance(self, address: str) -> float:
        """TRX Balance of address, 0 if not activated

        Args:
            address (str): wallet address

        Returns:
            float: TRX balance
        """
        try:
            balance = self.client.get_account_balance(str(address))
        except Exception as e:
            return 0.0
        return float(balance)

    def usdt_balance(self, address: str) -> int:
        url = self.tron_url + '/wallet/triggerconstantcontract'
        METHOD_BALANCE_OF = 'balanceOf(address)'
        payload = {
            'owner_address': base58.b58decode_check(address).hex(),
            'contract_address': base58.b58decode_check(self.usdt_address).hex(),
            'function_selector': METHOD_BALANCE_OF,
            'parameter': address_to_parameter(address),
        }
        resp = requests.post(url, json=payload)
        data = resp.json()

        if data['result'].get('result', None):
            print(data['constant_result'])
            val = data['constant_result'][0]
            print(address, 'balance =', int(val, 16))
            return int(val, 16)
        else:
            print('error:', bytes.fromhex(data['result']['message']).decode())
            return 0

    def usdt_txns(self, address: str) -> dict:
        """USDT Transactions of the wallet
         taken from the  trongrid  API 200 last
        Args:
            address (str): wallet adress

        Returns:
            dict: {success, result:[transaction list]}
        """
        url = f"{self.trongrid_url}/v1/accounts/{address}/transactions/trc20?limit=200&contract_address={self.usdt_address}"
        try:
            r = requests.get(url)
        except Exception as e:
            error_string = f"Error getting usdt txns from {address} - {str(e)}"
            return {'success': False, 'result': error_string}
        else:
            print(url)
            return {'success': True, 'result': r.json()}

    def transaction_detail(self, transaction_hash: str) -> dict:
        """Transaction details of a given tx hash

        Args:
            transaction_hash (str): tx hash

        Returns:
            dict: transaction details
        """
        info = self.client.get_transaction_info(str(transaction_hash))
        return info

    def send_usdt(self, source: str, destination: str, amount: int, private_key: str) -> dict:
        """Send USDT

        Args:
            source (str): sender address
            destination (str): receiver address
            amount (int): amount to send in wei
            private_key (str): sender private key

        Returns:
            dict: status, result check
        """
        try:
            priv_key = PrivateKey(bytes.fromhex(private_key))
            txn = (
                self.usdt_contract.functions.transfer(destination, amount)
                .with_owner(source)  # address of the private key
                .fee_limit(self.fee_limit)
                .build()
                .sign(priv_key)
                .broadcast()
                .wait()
            )

        except Exception as ex:
            return {"result": "Error",
                    "description": f"Error transferring of {amount} USDT from {source} to {destination} - {str(ex)} "}
        else:
            print(txn)
            return {"result": "Success", "tx": txn}

    def send_trx(self, source: str, destination: str, amount: int, private_key: str) -> dict:
        """Send TRX

        Args:
            source (str): sender address
            destination (str): receiver address
            amount (int): amount to send in wei
            private_key (str): sender key

        Returns:
            dict: status, result
        """
        try:
            priv_key = PrivateKey(bytes.fromhex(private_key))
            txn = (
                self.client.trx.transfer(str(source), str(destination), int(amount))
                .build()
                .inspect()
                .sign(priv_key)
                .broadcast()
                .wait()
            )

        except Exception as ex:
            return {"result": "Error",
                    "description": f"Error transferring of {amount} TRX from {source} to {destination} - {str(ex)}"}
        else:
            return {"result": "Success", "tx": txn}


# Оплата
tc = TronClient()
# Центральный кошелек для этого демо - первый кошелек в базе. Если его нет, создаем его

if not Wallet.objects.all().count() == 0:
    wallet = tc.create_wallet()
    w = Wallet(address=wallet['base58check_address'], pkey=wallet['private_key'])
    w.save()
central = Wallet.objects.all().first()

# Газ, необходимый для транзакции пересылки (TRX wei)
gas_needed = 8 * 10 ** 6


# Создание нового кошелька
def generate_wallet(request):
    if request.method == 'GET':
        wallet = tc.create_wallet()
        w = Wallet()
        w.address = wallet['base58check_address']
        w.pkey = wallet['private_key']
        w.save()
    return redirect(request.META.get('HTTP_REFERER', 'redirect_if_referer_not_found'))


# Сбор USDT с кошелька
# @app.route('/collect_usdt', methods=['POST'])
def collect_usdt(request):
    w = Wallet.objects.get(address=request.form.get('address'))
    pkey = w.pkey
    trx_bal = tc.trx_balance(w.address)
    if trx_bal < gas_needed:
        a = tc.send_trx(central.address, w.address, gas_needed - trx_bal, central.pkey)
        if a.get('result') == 'Success':
            tx = a.get('tx', {})
        tx_id = tx.get('id', '')
        tx_fee = tx.get('fee', 0)
        tx_timestamp = int(tx.get('blockTimeStamp', 0) / 1000)
        new_tx = Transaction(tx_id=tx_id,
                             sender=central.address,
                             receiver=w.address,
                             currency='TRX',
                             amount=trx_bal,
                             fee=tx_fee,
                             timestamp=tx_timestamp,
                             )
        new_tx.save()

    a = tc.send_usdt(w.address, central.address, 1 * 10 ** 6, w.pkey)
    if a.get('result') == 'Success':
        tx = a.get('tx', {})
        tx_id = tx.get('id', '')
        tx_fee = tx.get('fee', 0)
        tx_timestamp = int(tx.get('blockTimeStamp', 0) / 1000)
        new_tx = Transaction(tx_id=tx_id,
                             sender=w.address,
                             receiver=central.address,
                             currency='USDT',
                             amount=1,
                             fee=tx_fee,
                             timestamp=tx_timestamp,
                             )
        new_tx.save()
        return new_tx
    else:
        return False


# Отправка TRX на кошелек
# @app.route('/send_trx', methods=['POST'])
def send_trx(request):
    # print(request.form)
    w = Wallet.objects.get(address=request.form.get('address'))
    pkey = w.pkey

    a = tc.send_trx(central.address, w.address, 10, central.pkey)
    if a.get('result') == 'Success':
        tx = a.get('tx', {})
        tx_id = tx.get('id', '')
        tx_fee = tx.get('fee', 0)
        tx_timestamp = int(tx.get('blockTimeStamp', 0) / 1000)
        new_tx = Transaction(tx_id=tx_id,
                             sender=central.address,
                             receiver=w.address,
                             currency='TRX',
                             amount=1,
                             fee=tx_fee,
                             timestamp=tx_timestamp,
                             )
        new_tx.save()
        return new_tx
    else:
        return False


# Отправка USDT на кошелек
# @app.route('/send_usdt', methods=['POST'])
def send_usdt(request):
    if request.method == "POST":
        w = Wallet.objects.get(address=request.form.get('address'))
        pkey = w.pkey
        a = tc.send_usdt(central.address, w.address, 1 * 10 ** 6, central.pkey)
        if a.get('result') == 'Success':
            tx = a.get('tx', {})
            tx_id = tx.get('id', '')
            tx_fee = tx.get('fee', 0)
            tx_timestamp = int(tx.get('blockTimeStamp', 0) / 1000)
            new_tx = Transaction(tx_id=tx_id,
                                 sender=central.address,
                                 receiver=w.address,
                                 currency='USDT',
                                 amount=1,
                                 fee=tx_fee,
                                 timestamp=tx_timestamp,
                                 )
            new_tx.save()
            return new_tx
        else:
            return False
    else:
        return render(request, 'backend/send_usdt.html')


# Удаление из базы всех кошельков кроме центрального
# @app.route('/delete', methods=['GET'])
def delete(request):
    # wallets = select(w for w in Wallet if w.id > 1)[:]
    wallets = Wallet.objects.first(id__gte=1)
    for w in wallets:
        w.delete()
    wallets.save()
    return '<p>Wallets Deleted</p>'


"""
# Функция просмотра баланса USDT (декоратор для Jinja )
@app.context_processor
def utility_processor():
    def get_usdt_balance(address):
        bal = tc.usdt_balance(address)
        return bal / 10 ** 6

    return dict(get_usdt_balance=get_usdt_balance)


# Функция просмотра баланса TRX (декоратор для Jinja )
@app.context_processor
def utility_processor_2():
    def get_trx_balance(address):
        bal = tc.trx_balance(address)
        return bal

    return dict(get_trx_balance=get_trx_balance)

"""


def get_usdt_balance(address):
    bal = tc.usdt_balance(address)
    return bal / 10 ** 6


def get_trx_balance(address):
    bal = tc.trx_balance(address)
    return bal


# Главная
# @app.route('/', methods=['GET'])
def main(request):
    # wallets = select(w for w in Wallet)[:]
    wallets = Wallet.objects.all()
    # transactions = select(t for t in Transaction)[:]
    transactions = Transaction.objects.all()
    # usdt_balances = {a: await get_usdt_balance(a) for a in  select(t.address for t in Wallet)[:]}
    # trx_balances = {a: await get_trx_balance(a) for a in  select(t.address for t in Wallet)[:]}
    a = dict()
    for el in wallets:
        a[el] = get_usdt_balance(w.address)
    b = dict()
    for el in wallets:
        b[el] = get_trx_balance(w.address)
    return render(request, 'backend/paymant.html', {'wallets': wallets, 'transactions': transactions,
                                                    'a': a, 'b': b})
