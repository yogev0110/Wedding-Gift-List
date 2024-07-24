from flask import request, jsonify
from config import app, db
from models import Contact


@app.route("/contacts", methods=["GET"])
def get_contacts():
    contacts = Contact.query.all()
    json_contacts = [contact.to_json() for contact in contacts]
    return jsonify({"contacts": json_contacts})


@app.route("/create_contact", methods=["POST"])
def create_contact():
    first_name = request.json.get("firstName")
    last_name = request.json.get("lastName")
    gift = request.json.get("gift")
    number_of_guests = request.json.get("numberOfGuests")

    if not first_name or not last_name or not gift or not number_of_guests:
        return jsonify(
            (
                {
                    "message": "You must include first name, last name, gift and number of guests"
                }
            ),
            400,
        )
    new_contact = Contact(first_name=first_name, last_name=last_name, gift=gift, number_of_guests=number_of_guests)
    try:
        db.session.add(new_contact)
        db.session.commit()
    except Exception as e:
        return jsonify({"message": str(e)}), 400
    
    return jsonify({"message": "User created!"}), 201

@app.route("/update_contact/<int:user_id>", methods=["PATCH"])
def upadte_contact(user_id):
    contact = Contact.query.get(user_id)
    
    if not contact:
        return jsonify({"message": "User not found"}), 404
    
    data = request.json
    contact.first_name = data.get("firstName", contact.first_name)
    contact.last_name = data.get("lastName", contact.last_name)
    contact.gift = data.get("gift", contact.gift)
    contact.number_of_guests = data.get("numberOfGuests", contact.number_of_guests)

    db.session.commit()
    return jsonify({"message": "User updated!"}), 200

@app.route("/delete_contact/<int:user_id>", methods=["DELETE"])
def delete_contact(user_id):
    contact = Contact.query.get(user_id)
    
    if not contact:
        return jsonify({"message": "User not found"}), 404
    
    db.session(contact)
    db.session.commit()
    
    return jsonify({"message": "User deleted"}), 200

if __name__ == "__main__":
    with app.app_context():
        db.create_all()

    app.run(debug=True)
