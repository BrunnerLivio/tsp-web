#!/bin/bash

count=0

while [ $count -lt 30 ]; do
    # Generate a random number between 1 and 100
    random_number=$((RANDOM))
    sleep_time=$(awk -v min=0.1 -v max=2 -v seed="$RANDOM" 'BEGIN{srand(seed); print min+rand()*(max-min)}')

    # Print the random number
    echo "Sleep Time: $sleep_time"

    # Increment the count
    ((count++))

    # Sleep for 1 second
    sleep $sleep_time
done
