library(jsonlite)

figures <- fromJSON("output/figures.json")
# ads <- fromJSON("output/ads.json")

output <- list()
output$figures <- figures$figures
# output$ads <- ads$ads

json_data <- jsonlite::toJSON(output, pretty = TRUE, auto_unbox = TRUE)
write(json_data, file = "../assets/data/dataset.json")

print("Successfully combined figures and ads into dataset.json")
