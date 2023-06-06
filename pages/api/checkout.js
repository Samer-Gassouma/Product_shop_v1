import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { Order } from "@/models/Order";
import sgMail from "@sendgrid/mail";
export default async function handler(req, res) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  if (req.method !== "POST") {
    res.json("should be a POST request");
    return;
  }
  const { name, userEmail, phone, city, postalCode, Address, cartProducts, total } =
    req.body;
  await mongooseConnect();
  const productsIds = cartProducts;
  const uniqueIds = [...new Set(productsIds)];
  const productsInfos = await Product.find({ _id: uniqueIds });

  let line_items = [];
  for (const productId of uniqueIds) {
    const productInfo = productsInfos.find(
      (p) => p._id.toString() === productId
    );
    const quantity = productsIds.filter((id) => id === productId)?.length || 0;
    if (quantity > 0 && productInfo) {
      line_items.push({
        quantity,
        price_data: {
          currency: "TND",
          product_data: { name: productInfo.title },
          unit_amount: quantity * productInfo.price,
        },
      });
    }
  }

  const orderDoc = await Order.create({
    line_items,
    name,
    userEmail,
    phone,
    city,
    postalCode,
    Address,
    total,
    paid: false,
  });
  if (orderDoc) {
    const msg = {
      to: userEmail, // User's email address
      from: "samer.samm12@gmail.com", // Your email address
      subject: "Order Confirmation",
      html: `
        <p>Thank you for your order!</p>
        <p>Your order ID is: ${orderDoc._id}</p>
        <p>We will process your order and notify you once it's shipped.</p>
        <p>Thank you for shopping with us!</p>
      `,
    };
    // Send the email
    sgMail
      .send(msg)
      .then(() => {
        console.log("Email sent");
      })
      .catch((error) => {
        console.error(error);
      });
    res.status(200).json({
      success: true,
      sessionId: orderDoc._id,
    });
  } else {
    res.status(400).json({
      success: false,
    });
  }
}
