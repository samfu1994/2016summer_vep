import csv

SIZE = 10000;
with open("ubiq3.csv", 'rb') as csvfile:
	reader = csv.reader(csvfile, delimiter=',', quotechar='|')
	count = 0
	with open("test_ubiq.csv", 'wb') as testcsv:
		writer = csv.writer(testcsv)
		for row in reader:
			writer.writerows(row)
			count += 1
			if count == SIZE:
				break;