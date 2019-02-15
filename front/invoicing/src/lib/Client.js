export class Clients{
    constructor(clients) {
        this.clients = clients.map(c => c instanceof Client ? c : new Client(c));
    }
    
    get clientsName(){
        return this.clients.map(c => c.name);
    }

    find = (name) => this.clients.find(c => c.name === name);

    add(newClient) {
        const id = this.clients.length ? this.clients.sort((c1, c2) => c1.id < c2.id)[0].id + 1 : 0
        return new Clients([...this.clients, newClient.update({id: id})]);
    }
}

export class Client{
    constructor({id, ...args}){
        this.id = id;
        this.address = new ClientAddress(args);
    }

    get name(){return this.address.name;}
    get number(){return this.address.number;}
    get street(){return this.address.street;}
    get city(){return this.address.city;}
    get postalCode(){return this.address.postalCode;}
    get additionalAddressDetails(){return this.address.additionalAddressDetails;}

    update(field, value) {
        return new Client({
            ...this.address,
            [field]: value
        });
    }
}

class ClientAddress {
    constructor({name, number, street, city, postalCode, additionalAddressDetails = null}){
        this.name = name;
        this.number = number;
        this.street = street;
        this.city = city;
        this.postalCode = postalCode; // Should be a string because "01" is valid
        this.additionalAddressDetails = additionalAddressDetails;
     }
}
