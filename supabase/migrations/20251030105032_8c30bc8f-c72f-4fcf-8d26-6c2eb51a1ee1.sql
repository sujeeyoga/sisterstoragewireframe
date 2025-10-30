-- Remove test abandoned cart entry
DELETE FROM abandoned_carts 
WHERE email = 'mahreen3131@gmail.com' 
AND created_at = '2025-10-30 02:57:00.008212+00';