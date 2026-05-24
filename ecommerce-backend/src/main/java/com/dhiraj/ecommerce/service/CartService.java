package com.dhiraj.ecommerce.service;

import com.dhiraj.ecommerce.dto.CartItemResponseDTO;
import com.dhiraj.ecommerce.dto.CartResponseDTO;
import com.dhiraj.ecommerce.entity.Cart;
import com.dhiraj.ecommerce.entity.CartItem;
import com.dhiraj.ecommerce.entity.Product;
import com.dhiraj.ecommerce.entity.User;
import com.dhiraj.ecommerce.repository.CartItemRepository;
import com.dhiraj.ecommerce.repository.CartRepository;
import com.dhiraj.ecommerce.repository.ProductRepository;
import com.dhiraj.ecommerce.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    @Transactional
    public String addToCart(String userEmail, Long productId, int quantity) {

        if (quantity < 1) {
            throw new ResponseStatusException(BAD_REQUEST, "Quantity must be at least 1");
        }

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "User not found"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Product not found"));

        Cart cart = cartRepository.findByUserEmail(userEmail)
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setUser(user);
                    return cartRepository.save(newCart);
                });

        CartItem item = cartItemRepository.findByCartIdAndProductId(cart.getId(), productId)
                .orElseGet(() -> {
                    CartItem newItem = new CartItem();
                    newItem.setCart(cart);
                    newItem.setProduct(product);
                    newItem.setQuantity(0);
                    return newItem;
                });

        item.setQuantity(item.getQuantity() + quantity);
        cartItemRepository.save(item);

        return "Item added to cart successfully";
    }

    @Transactional(readOnly = true)
    public CartResponseDTO getMyCart(String userEmail) {
        Cart cart = cartRepository.findByUserEmail(userEmail)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Cart not found"));

        return mapCartToResponse(cart);
    }

    @Transactional
    public String updateCartItemQuantity(String userEmail, Long itemId, int quantity) {
        if (quantity < 1) {
            throw new ResponseStatusException(BAD_REQUEST, "Quantity must be at least 1");
        }

        Cart cart = cartRepository.findByUserEmail(userEmail)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Cart not found"));

        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Cart item not found"));

        if (item.getCart().getId() != cart.getId()) {
            throw new ResponseStatusException(BAD_REQUEST, "Cart item does not belong to this user");
        }

        item.setQuantity(quantity);
        cartItemRepository.save(item);
        return "Cart item quantity updated";
    }

    @Transactional
    public String removeCartItem(String userEmail, Long itemId) {
        Cart cart = cartRepository.findByUserEmail(userEmail)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Cart not found"));

        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Cart item not found"));

        if (item.getCart().getId() != cart.getId()) {
            throw new ResponseStatusException(BAD_REQUEST, "Cart item does not belong to this user");
        }

        cartItemRepository.delete(item);
        return "Cart item removed";
    }

    private CartResponseDTO mapCartToResponse(Cart cart) {
        List<CartItemResponseDTO> items = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;

        for (CartItem item : cart.getItems()) {
            CartItemResponseDTO itemDto = new CartItemResponseDTO();
            itemDto.setItemId(item.getId());
            itemDto.setProductId(item.getProduct().getId());
            itemDto.setProductName(item.getProduct().getName());
            itemDto.setPrice(item.getProduct().getPrice());
            itemDto.setQuantity(item.getQuantity());

            BigDecimal lineTotal = item.getProduct().getPrice()
                    .multiply(BigDecimal.valueOf(item.getQuantity()));
            itemDto.setLineTotal(lineTotal);

            items.add(itemDto);
            total = total.add(lineTotal);
        }

        CartResponseDTO response = new CartResponseDTO();
        response.setCartId(cart.getId());
        response.setUserEmail(cart.getUser().getEmail());
        response.setItems(items);
        response.setTotalAmount(total);
        return response;
    }
}
