output <- list()
output$ads <- list()

json_data <- jsonlite::toJSON(output, pretty = TRUE, auto_unbox = TRUE)
write(json_data, file = "output/ads.json")

print("Successfully processed ads and saved to output/ads.json")
