import Orders from "../models/Orders.js";

export const createOrder = async (req, res) => {
  try {
    const { price, order_status } = req.body;
    const users_id = req.user.id;

    if (!price) {
      return res.status(400).json({ message: "Le prix est requis." });
    }

    const newOrder = await Orders.create({
      users_id,
      price,
      order_status
    });

    res.status(201).json({
      message: "Commande créée avec succès.",
      order: newOrder
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Orders.findAll();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Orders.findByUser(userId);
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Orders.findById(id);

    if (!order) {
      return res.status(404).json({ message: "Commande non trouvée." });
    }

    if (req.user.role !== "staff" && order.users_id !== req.user.id) {
      return res.status(403).json({ message: "Action non autorisée." });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updated = await Orders.updateByUser(
      id,
      req.user.id,
      updates,
      req.user.role
    );

    res.status(200).json({
      message: "Commande mise à jour avec succès.",
      order: updated
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Orders.deleteByUser(
      id,
      req.user.id,
      req.user.role
    );

    if (!deleted) {
      return res.status(404).json({ message: "Commande introuvable." });
    }

    res.status(200).json({ message: "Commande supprimée avec succès." });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};