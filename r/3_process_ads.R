source("./1_prepare_input.R")

if (file.exists("input/processed/ads.rds")) {
  ads <- readRDS("input/processed/ads.rds")
  print("Successfully loaded ads.")
} else {
  stop("Cannot find ads.rds. Make sure to run 1_prepare_input.R first")
}

if (file.exists("input/processed/events.rds")) {
  events <- readRDS("input/processed/events.rds")
  print("Successfully loaded events.")
} else {
  stop("Cannot find events.rds. Make sure to run 1_prepare_input.R first")
}

if (file.exists("input/processed/categories.rds")) {
  categories <- readRDS("input/processed/categories.rds")
  print("Successfully loaded categories.")
} else {
  stop("Cannot find categories.rds. Make sure to run 1_prepare_input.R first")
}

output <- list()
output$categories <- list()
output$ads <- list()
output$events <- list()

for (i in seq_len(nrow(categories))) {
  category <- list(
    id =  categories$id[i],
    name = categories$name[i],
    description = categories$description[i],
    color = categories$color[i]
  )
  output$categories[[i]] <- category
}

for (i in seq_len(nrow(ads))) {
  ad <- list(
    id = paste0(ads$year[i], "-", ads$category[i]),
    year = ads$year[i],
    category = ads$category[i],
    name = ads$name[i],
    short_name = ads$short_name[i],
    client = ads$client[i],
    slogan = ads$slogan[i],
    agency = ads$agency[i],
    youtube_link = ads$youtube_link[i],
    description = ads$description[i]
  )
  output$ads[[i]] <- ad
}

for (i in seq_len(nrow(events))) {
  categories <- if (!is.na(events$category_ids[i]) && nchar(events$category_ids[i]) > 0) {
    unlist(strsplit(events$category_ids[i], ","))
  } else {
    character(0)  # Empty character vector for an empty array
  }

  event <- list(
    year = events$year[i],
    name = events$name[i],
    categories = categories
  )
  output$events[[i]] <- event
}

json_data <- jsonlite::toJSON(output, pretty = TRUE, auto_unbox = TRUE)
write(json_data, file = "output/ads.json")

print("Successfully processed ads and saved to output/ads.json")
