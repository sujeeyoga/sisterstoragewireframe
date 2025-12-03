-- Move @shawtysin video to position 3 and shift others down
UPDATE sister_stories SET display_order = 4 WHERE id = '37e17c26-aca4-469b-b8c7-e46b72c2d32a'; -- Sister Story 2 (was 3)
UPDATE sister_stories SET display_order = 5 WHERE id = '97c92740-8fa6-4680-9f0a-beb9b03ec138'; -- Sister Story 3 (was 4)
UPDATE sister_stories SET display_order = 6 WHERE id = '0f466ec6-d2bf-4700-bba5-21f49600068a'; -- Sister Story 4 (was 5)
UPDATE sister_stories SET display_order = 7 WHERE id = '89ba5860-4ad4-431c-b953-c0dbef8e2b2f'; -- Sister Story 5 (was 6)
UPDATE sister_stories SET display_order = 3 WHERE id = '2e1c378d-07a9-4746-9562-b6c818a7a81a'; -- @shawtysin to position 3