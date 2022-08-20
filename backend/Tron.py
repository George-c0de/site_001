from tronpy import Contract, Tron
import base58
from tronpy.keys import PrivateKey
from tronpy.providers import HTTPProvider
import requests
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
class TronClient:
    """TRON API Client
    """

    def __init__(self, config=False):
        """class initialization

        Args:
            config (optional): app config object, defaults to nile testnet
        """
        if not config or config == {}:
            self.tron_url = "https://api.trongrid.io/"
            self.trongrid_url = 'https://api.trongrid.io/'
            self.usdt_address = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t"
            self.fee_limit = 20000000
            self.api_key = '2f2b558d-51a3-48b9-9c4d-cd5b9c69163b'

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
        url = f"{self.trongrid_url}/v1/accounts/{address}/transactions/trc20?limit=200&contract_address=" \
              f"{self.usdt_address}"
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