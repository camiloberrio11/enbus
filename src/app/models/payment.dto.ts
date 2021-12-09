/// Modelo para manejar la informacion del pago
export class Payment {
    amount: string;
    merchant: string;
    email: string;
    country: number;
    order: string;
    money: string;
    description: string;
    language: string;
    recurrent: boolean;
    expiration: string;
    iva: string;
    method: string;
    checksum: string;
    user_id: string;
    user_type_id: string;
    user_name: string;
    redirect_timeout: string;
}