
package shafique.java.stream;

import java.util.List;
import java.util.stream.Stream;
import java.util.Arrays;
import java.util.Comparator;
import java.util.HashMap;
import java.util.IntSummaryStatistics;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Spliterator;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import java.util.stream.Stream;

public class StructureOfStream {
    public static void main(String[] args) {
        List<String> namesList = List.of("Singapore", "Casablanca", "Tripoli", "Jeddah", "Phuket"); 
        basicStream(namesList);
        structureOfStream(namesList);
        sourcesOfStream(namesList);
        intermediateMethods(namesList);
        terminalMethods(namesList);
        chaining(namesList);
        maxSalary();
    }

    // region Basic things
    public static void basicStream(List<String> namesList){
        
        // A stream a conveyer belt of data, not its copy.
        Stream<String> belt = namesList.stream();

        // Count its elements.
        System.out.println(belt.count());

        // Stream is used once. Reusing it will throw an exception.
        try{
            // Attempt to reuse the stream
            belt.count();
            // or
            belt.forEach(System.out::println);
        }
        catch(IllegalStateException e){
            System.out.println("Stream has already been used: " + e.getMessage());
        }        
    }

    public static void structureOfStream(List<String> namesList){
        // It has a strucure: 1 source >> many intermediate >> 1 terminal

        namesList.stream()                              // 1. source
                .filter(s -> s.length() > 2)            // 2. intermediate
                .map(s -> s.toUpperCase())              // 2. intermediate
                .sorted()                               // 2. intermediate
                .forEach(s -> System.out.println(s));   // 3. terminal runs it, w/o terminal no activity

        // Original list remains unchanged.
        System.out.println(namesList);

    }
    // endregion Basic things

    // region Sources of Stream
    public static void sourcesOfStream(List<String> nameList){
        // Generally you will make a stream from the Collection, e.g. nameList.

        // Other sources include: Arrays.stream(put an array here)
        String[] subjects = {"Singapore", "Malaysia", "New Zealand"};
        Arrays.stream(subjects).forEach(System.out::println); // from an array

        // Other sources include Stream.of( put the values here)
        Stream.of("IT", "Finance", "HR").forEach(System.out::println);  // from values

        // Other sources include IntStream.range
        IntStream.range(1, 4).forEach(System.out::println);   // 1, 2, 3

        // Map has no .stream() method,  so use map.entrySet(), map.keySet() or map.values()
        Map<Integer, String> employeeMap = new HashMap<>();
        employeeMap.put(101, "Helen");
        employeeMap.put(102, "Kelly");
        employeeMap.put(103, "Idris");
        employeeMap.entrySet().stream()
                                .forEach(entry  -> System.out.println(entry.getKey()));

    }
    // endregion Sources of Stream

    // region Intermediate Methods of Stream
    public static void intermediateMethods(List<String> namesList){
        // All intermediate methods on Stream<T>. Each returns a new stream, so they can be chained.
        //
        //  Keep or drop    filter, distinct, limit, skip, takeWhile, dropWhile
        //  Change          map, mapToInt, mapToLong, mapToDouble
        //  One to many     flatMap, flatMapToInt, flatMapToLong, flatMapToDouble,
        //                  mapMulti, mapMultiToInt, mapMultiToLong, mapMultiToDouble
        //  Order           sorted(), sorted(Comparator)
        //  Look            peek
        //  Behaviour       parallel, sequential, unordered, onClose
        //
        // namesList = Singapore(9), Casablanca(10), Tripoli(7), Jeddah(6), Phuket(6)

        // ---------- Keep or drop ----------
        System.out.println("--- filter: keep the elements that pass the test ---");
        namesList.stream()
                .filter(s -> s.length() > 6)                   // Singapore, Casablanca, Tripoli
                .forEach(System.out::println);

        System.out.println("--- distinct: remove duplicates ---");
        Stream.of("Jeddah", "Phuket", "Jeddah")
                .distinct()                                    // Jeddah, Phuket
                .forEach(System.out::println);

        System.out.println("--- limit: keep the first n ---");
        namesList.stream()
                .limit(2)                                      // Singapore, Casablanca
                .forEach(System.out::println);

        System.out.println("--- skip: drop the first n ---");
        namesList.stream()
                .skip(3)                                       // Jeddah, Phuket
                .forEach(System.out::println);

        System.out.println("--- takeWhile: keep until the test first fails ---");
        namesList.stream()
                .takeWhile(s -> s.length() > 6)                // Singapore, Casablanca, Tripoli
                .forEach(System.out::println);

        System.out.println("--- dropWhile: drop until the test first fails ---");
        namesList.stream()
                .dropWhile(s -> s.length() > 6)                // Jeddah, Phuket
                .forEach(System.out::println);

        // ---------- Change ----------
        System.out.println("--- map: change each element ---");
        namesList.stream()
                .map(s -> s.toUpperCase())                     // SINGAPORE, CASABLANCA, ...
                .forEach(System.out::println);

        System.out.println("--- mapToInt / mapToLong / mapToDouble: change to numbers ---");
        System.out.println(namesList.stream()
                .mapToInt(s -> s.length())                     // IntStream: 9, 10, 7, 6, 6
                .sum());                                       // 38
        System.out.println(namesList.stream()
                .mapToLong(s -> s.length())                    // LongStream
                .max().getAsLong());                           // 10
        System.out.println(namesList.stream()
                .mapToDouble(s -> s.length())                  // DoubleStream
                .average().getAsDouble());                     // 7.6

        // ---------- One to many ----------
        System.out.println("--- flatMap: each element becomes a stream, all joined into one ---");
        Stream.of(List.of("Singapore", "Tripoli"), List.of("Jeddah"))
                .flatMap(list -> list.stream())                // Singapore, Tripoli, Jeddah
                .forEach(System.out::println);

        System.out.println("--- flatMapToInt: each element becomes an IntStream ---");
        System.out.println(namesList.stream()
                .flatMapToInt(s -> s.chars())                  // every letter as a number
                .count());                                     // 38 letters

        System.out.println("--- mapMulti: push 0, 1 or many values for each element ---");
        namesList.stream()
                .<String>mapMulti((s, downstream) -> {
                    if (s.length() == 6) {                     // only Jeddah and Phuket
                        downstream.accept(s);
                        downstream.accept(s.toLowerCase());
                    }
                })                                             // Jeddah, jeddah, Phuket, phuket
                .forEach(System.out::println);

        System.out.println("--- mapMultiToInt: same, but pushes ints ---");
        namesList.stream()
                .mapMultiToInt((s, downstream) -> downstream.accept(s.length()))   // 9, 10, 7, 6, 6
                .forEach(System.out::println);

        // ---------- Order ----------
        System.out.println("--- sorted(): natural order (A to Z) ---");
        namesList.stream()
                .sorted()                                      // Casablanca, Jeddah, Phuket, Singapore, Tripoli
                .forEach(System.out::println);

        System.out.println("--- sorted(Comparator): your own order ---");
        namesList.stream()
                .sorted(Comparator.comparing(s -> s.length())) // Jeddah, Phuket, Tripoli, Singapore, Casablanca
                .forEach(System.out::println);

        // ---------- Look ----------
        System.out.println("--- peek: look at each element without changing it ---");
        namesList.stream()
                .peek(s -> System.out.println("before filter: " + s))
                .filter(s -> s.startsWith("S"))
                .peek(s -> System.out.println("after filter:  " + s))
                .forEach(s -> {});

        // ---------- Behaviour ----------
        System.out.println("--- parallel / sequential: run on many threads or one ---");
        namesList.stream()
                .parallel()                                    // order of output is not guaranteed
                .forEach(System.out::println);
        namesList.stream()
                .parallel()
                .sequential()                                  // the last call wins, so this runs on one thread
                .forEach(System.out::println);

        System.out.println("--- unordered: tells Java the order does not matter (can be faster in parallel) ---");
        namesList.stream()
                .unordered()
                .forEach(System.out::println);

        System.out.println("--- onClose: run code when the stream is closed ---");
        try (Stream<String> s = namesList.stream().onClose(() -> System.out.println("stream closed"))) {
            s.forEach(System.out::println);
        }                                                      // "stream closed" prints here
    }
    // endregion Intermediate Methods of Stream

    // region Terminal Methods of Stream
    public static void terminalMethods(List<String> namesList){
        // All terminal methods on Stream<T>. Each one runs the stream and ends it, so it can only be called once.
        //
        //  Do something    forEach, forEachOrdered
        //  Check           anyMatch, allMatch, noneMatch
        //  Find            findFirst, findAny, min, max
        //  Count           count
        //  Combine         reduce (3 forms)
        //  Collect         toList, toArray, collect(Collector), collect(supplier, accumulator, combiner)
        //  Step by step    iterator, spliterator
        //  Numbers only    sum, average, summaryStatistics   (on IntStream, LongStream, DoubleStream)
        //
        // namesList = Singapore(9), Casablanca(10), Tripoli(7), Jeddah(6), Phuket(6)

        // ---------- Do something ----------
        System.out.println("--- forEach: do something with each element ---");
        namesList.stream()
                .forEach(s -> System.out.println(s));          // Singapore, Casablanca, ...

        System.out.println("--- forEachOrdered: like forEach, but keeps the order even in parallel ---");
        namesList.parallelStream()
                .forEachOrdered(s -> System.out.println(s));   // always Singapore, Casablanca, ...

        // ---------- Check: return true or false ----------
        System.out.println("--- anyMatch / allMatch / noneMatch ---");
        System.out.println(namesList.stream().anyMatch(s -> s.startsWith("J")));   // true, Jeddah
        System.out.println(namesList.stream().allMatch(s -> s.length() > 6));      // false, Jeddah is 6
        System.out.println(namesList.stream().noneMatch(s -> s.isEmpty()));        // true, none are empty

        // ---------- Find: return an Optional, because the stream might be empty ----------
        System.out.println("--- findFirst / findAny ---");
        Optional<String> first = namesList.stream().findFirst();
        System.out.println(first.get());                                            // Singapore
        System.out.println(namesList.stream().findAny().get());                    // any one, Singapore when not parallel

        System.out.println("--- min / max: need a Comparator ---");
        System.out.println(namesList.stream().min(Comparator.comparing(s -> s.length())).get());   // Jeddah (shortest)
        System.out.println(namesList.stream().max(Comparator.comparing(s -> s.length())).get());   // Casablanca (longest)

        // ---------- Count ----------
        System.out.println("--- count ---");
        System.out.println(namesList.stream().count());                            // 5

        // ---------- Combine: reduce many elements into one value ----------
        System.out.println("--- reduce(accumulator): no start value, so returns an Optional ---");
        Optional<String> joined = namesList.stream()
                .reduce((a, b) -> a + " & " + b);
        System.out.println(joined.get());                                          // Singapore & Casablanca & ...

        System.out.println("--- reduce(identity, accumulator): start value, same type ---");
        String initials = namesList.stream()
                .reduce("", (result, s) -> result + s.charAt(0));
        System.out.println(initials);                                              // SCTJP

        System.out.println("--- reduce(identity, accumulator, combiner): result is a different type ---");
        int totalLetters = namesList.stream()
                .reduce(0, (sum, s) -> sum + s.length(), (a, b) -> a + b);
        System.out.println(totalLetters);                                          // 38

        // ---------- Collect: put the elements into a container ----------
        System.out.println("--- toList: the easy way to get a List (Java 16+, read only) ---");
        List<String> shortNames = namesList.stream()
                .filter(s -> s.length() == 6)
                .toList();
        System.out.println(shortNames);                                            // [Jeddah, Phuket]

        System.out.println("--- toArray ---");
        String[] array = namesList.stream().toArray(String[]::new);
        System.out.println(Arrays.toString(array));                                // [Singapore, Casablanca, ...]

        System.out.println("--- collect(Collector): Collectors has ready made containers ---");
        List<String> list = namesList.stream().collect(Collectors.toList());       // a List you can change
        System.out.println(list);
        System.out.println(namesList.stream().collect(Collectors.joining(", ")));  // Singapore, Casablanca, ...
        Map<Integer, List<String>> byLength = namesList.stream()
                .collect(Collectors.groupingBy(s -> s.length()));
        System.out.println(byLength);                                              // {6=[Jeddah, Phuket], 7=[Tripoli], 9=[Singapore], 10=[Casablanca]}
        Map<Boolean, List<String>> longOrShort = namesList.stream()
                .collect(Collectors.partitioningBy(s -> s.length() > 6));
        System.out.println(longOrShort);                                           // {false=[Jeddah, Phuket], true=[Singapore, Casablanca, Tripoli]}
        Map<String, Integer> nameToLength = namesList.stream()
                .collect(Collectors.toMap(s -> s, s -> s.length()));
        System.out.println(nameToLength);                                          // {Singapore=9, Casablanca=10, ...} a Map has no fixed order
        System.out.println(namesList.stream().collect(Collectors.counting()));     // 5

        System.out.println("--- collect(supplier, accumulator, combiner): build your own container ---");
        StringBuilder builder = namesList.stream()
                .collect(() -> new StringBuilder(),            // make an empty container
                         (sb, s) -> sb.append(s.charAt(0)),    // add one element to it
                         (sb1, sb2) -> sb1.append(sb2));       // join two containers (used in parallel)
        System.out.println(builder);                                               // SCTJP

        // ---------- Step by step ----------
        System.out.println("--- iterator: pull elements one at a time ---");
        Iterator<String> it = namesList.stream().iterator();
        while (it.hasNext()) {
            System.out.println(it.next());                                         // Singapore, Casablanca, ...
        }

        System.out.println("--- spliterator: an iterator that can split itself for parallel work ---");
        Spliterator<String> split = namesList.stream().spliterator();
        split.tryAdvance(s -> System.out.println("first: " + s));                 // first: Singapore
        split.forEachRemaining(s -> System.out.println("rest: " + s));            // rest: Casablanca, ...

        // ---------- Numbers only ----------
        System.out.println("--- sum / average / summaryStatistics: on IntStream, LongStream, DoubleStream ---");
        System.out.println(namesList.stream().mapToInt(s -> s.length()).sum());                       // 38
        System.out.println(namesList.stream().mapToInt(s -> s.length()).average().getAsDouble());     // 7.6
        IntSummaryStatistics stats = namesList.stream().mapToInt(s -> s.length()).summaryStatistics();
        System.out.println(stats);                     // count=5, sum=38, min=6, average=7.6, max=10, all in one pass
    }


    // endregion Terminal Methods of Stream

    // region Chaining Methods of Stream
    public static void chaining(List<String> namesList){

        // Chaining operations
        namesList.stream()                                     // 1. source
                .peek(s -> System.out.println("seen: " + s))   // 2. look at each element as it passes, handy for debugging
                .sorted(Comparator.reverseOrder())             // 2. sort with a custom order
                .skip(1)                                    // 2. skip the first n elements
                .limit(3)                             // 2. keep at most n elements
                .forEach(System.out::println);                 // 3. terminal

        // flatMap: each element becomes a stream, then all are flattened into one stream
        // distinct: removes duplicates ("Leo" appears twice)
        Stream.of(namesList, List.of("Ava", "Leo"))
                .flatMap(List::stream)                         // 2. Stream<List<String>> >> Stream<String>
                .distinct()                                    // 2. remove duplicates
                .forEach(System.out::println);                 // 3. terminal

        // mapToInt: switches to an IntStream, which has number methods like sum(), average()
        int totalLetters = namesList.stream()
                .mapToInt(String::length)                      // 2. Stream<String> >> IntStream
                .sum();                                        // 3. terminal
        System.out.println(totalLetters);

        // takeWhile: keep elements until the condition first fails, then stop
        // dropWhile: skip elements until the condition first fails, then keep the rest
        Stream.of(1, 2, 3, 10, 4, 5)
                .takeWhile(n -> n < 5)                         // 2. 1, 2, 3
                .forEach(System.out::println);
        Stream.of(1, 2, 3, 10, 4, 5)
                .dropWhile(n -> n < 5)                         // 2. 10, 4, 5
                .forEach(System.out::println);
    }
    // endregion Chaining Methods of Stream

    // region Example: Employee with max salary
    // A record is a short way to write a class that just holds data.
    // It gives you a constructor, getters name(), department(), salary(), and toString() for free.
    record Employee(String name, String department, int salary) {}

    public static void maxSalary(){
        List<Employee> employees = List.of(
                new Employee("Helen", "IT",      7000),
                new Employee("Kelly", "Finance", 9500),
                new Employee("Idris", "IT",      9500),
                new Employee("Soha",  "HR",      5000),
                new Employee("Ben",   "IT",      8200));

        System.out.println("--- max: the usual way ---");
        Optional<Employee> topPaid = employees.stream()                    // 1. source
                .max(Comparator.comparingInt(e -> e.salary()));            // 3. terminal, compare by salary
        System.out.println(topPaid.get());          // Employee[name=Kelly, department=Finance, salary=9500]
                                                    // on a tie, max keeps the first one it found

        System.out.println("--- only the name, and safe if the list is empty ---");
        String topName = employees.stream()
                .max(Comparator.comparingInt(e -> e.salary()))             // Optional<Employee>
                .map(e -> e.name())                                        // Optional<String>, map on the Optional, not the stream
                .orElse("No employees");                                   // the value, or this if empty
        System.out.println(topName);                                       // Kelly

        System.out.println("--- chained: max salary in IT only ---");
        employees.stream()
                .filter(e -> e.department().equals("IT"))                  // 2. Helen, Idris, Ben
                .max(Comparator.comparingInt(e -> e.salary()))             // 3. Idris
                .ifPresent(e -> System.out.println(e.name() + " earns " + e.salary()));   // Idris earns 9500

        System.out.println("--- all employees who share the max salary (handles ties) ---");
        int highest = employees.stream()
                .mapToInt(e -> e.salary())                                 // 2. IntStream of salaries
                .max()                                                     // 3. OptionalInt
                .orElse(0);                                                // 9500
        List<String> topEarners = employees.stream()
                .filter(e -> e.salary() == highest)                        // 2. Kelly, Idris
                .map(e -> e.name())                                        // 2. names only
                .toList();                                                 // 3.
        System.out.println(topEarners);                                    // [Kelly, Idris]

        System.out.println("--- top paid in each department ---");
        Map<String, Optional<Employee>> topPerDept = employees.stream()
                .collect(Collectors.groupingBy(
                        e -> e.department(),                                         // group by department
                        Collectors.maxBy(Comparator.comparingInt(e -> e.salary())))); // keep the max of each group
        topPerDept.forEach((dept, e) -> System.out.println(dept + ": " + e.get().name()));   // Finance: Kelly, HR: Soha, IT: Idris (a Map has no fixed order)

        System.out.println("--- other ways to get the same answer ---");
        // sort high to low, take the first
        System.out.println(employees.stream()
                .sorted(Comparator.comparingInt((Employee e) -> e.salary()).reversed())
                .findFirst()
                .get()
                .name());                                                  // Kelly
        // reduce: keep whichever of the two is bigger
        System.out.println(employees.stream()
                .reduce((a, b) -> a.salary() >= b.salary() ? a : b)
                .get()
                .name());                                                  // Kelly
    }
    // endregion Example: Employee with max salary

}
